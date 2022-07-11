/* eslint-disable max-len */
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const pointsForVote = 2;
const pointsToVote = 10;

const photosLimit = 12;

// const generateThumbnail = require("./generateThumbnail");

const getResizedName = (fileName, dimensions = "600x600") => {
  const extIndex = fileName.lastIndexOf(".");
  const ext = fileName.substring(extIndex);
  return `${fileName.substring(0, extIndex)}_${dimensions}${ext}`;
};

exports.getPhotos = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const userId = req.query.userId || req.body.data.userId;
    let requestUser = null;

    if (userId) {
      requestUser = (await admin.firestore().collection("users").doc(userId).get()).data();
    }
    let blockedUsers = [];
    const showTo = ["both"];
    if (requestUser) {
      showTo.push(requestUser.gender);
      blockedUsers = blockedUsers.concat(requestUser.blocks)
    }
    functions.logger.log("blockedUsers", blockedUsers);

    // Push the new message into Firestore using the Firebase Admin SDK.
    let photos = [];
    let photosQuery = admin.firestore().collectionGroup("photos")
      .where("active", "==", true)
      .where("showTo", "in", showTo)

    if (userId) {
      photosQuery = photosQuery.where("userId", "!=", userId)
    }
    // if (blockedUsers && blockedUsers.length) {
    //   photosQuery = photosQuery.where("userId", "not-in", blockedUsers)
    // }

    const photosSnap = await photosQuery
      .get();

    photosSnap.forEach((photo) => {
      photos.push(Object.assign(photo.data(), { id: photo.id, userId: photo.ref.parent.parent.id }));
    });

    // shuffle photos
    photos = photos.sort(() => .5 - Math.random());

    const photosToVote = [];

    await Promise.all(photos.map(async (photo) => {
      // don't serve more than the limit for performance
      if (photosToVote.length >= photosLimit) {
        return;
      }
      const user = await admin.firestore().collection("users").doc(photo.userId).get();

      if (blockedUsers.length && blockedUsers.includes(photo.userId)) {
        return;
      }

      if (requestUser && requestUser.showGender !== "both" && requestUser.showGender !== user.data().gender) {
        return;
      }

      const userPoints = user.data() ? user.data().points : 0;
      if (userPoints < pointsToVote) {
        return;
      }

      // check if user already voted
      if (userId) {
        const userVote = await admin.firestore().collection(`users/${userId}/votes`).doc(photo.id).get();
        if (userVote.exists) {
          return;
        }
      }
      photosToVote.push(photo);
    }));

    // Send photos
    res.json({ data: photosToVote });
  });
});


// Listens for votes changes to update photo rating and user points
exports.updatePhotoRating = functions.firestore.document("/users/{userId}/photos/{photoId}/votes/{documentId}")
  .onWrite(async (change, context) => {
    // Grab the current value of what was written to Firestore.
    const snap = change.after.exists ? change.after : null;

    // functions.logger.log("change", change);
    // functions.logger.log("snap", snap);

    let voterId = undefined;
    if (snap) {
      voterId = snap.data().userId;
    }
    const userId = context.params.userId;
    const photoId = context.params.photoId;

    const votesSnap = await admin.firestore()
      .collection("users").doc(userId)
      .collection("photos").doc(photoId)
      .collection("votes").get();

    const votes = [];
    votesSnap.forEach((vote) => {
      votes.push(vote.data().rate);
    });

    const votesTotal = votes.reduce((vote, acc) => {
      return parseFloat(acc) + parseFloat(vote);
    }, 0);

    const avg = votesTotal / votes.length;

    const photoSnap = await admin.firestore()
      .collection("users").doc(userId)
      .collection("photos").doc(photoId).get();
    const roundedAvg = Math.round(avg * 10) / 10;
    photoSnap.ref.set(
      {
        rate: roundedAvg,
        votesCount: votes.length,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

    const userSnap = await admin.firestore()
      .collection("users").doc(userId).get();
    const points = userSnap.data().points || 0;
    const newVotes = userSnap.data().newVotes || 0;
    if (points > 0) {
      userSnap.ref.set({ points: points - pointsToVote, newVotes: newVotes + 1 }, { merge: true });
    }

    if (voterId) {
      const voterSnap = await admin.firestore()
        .collection("users").doc(voterId).get();
      if (voterSnap.exists) {
        // add vote object to voter
        const voteObj = Object.assign(snap.data());
        delete voteObj.userId;
        admin.firestore().collection(`users/${voterId}/votes`).doc(photoId).set(voteObj);
        // increase voter points
        if (voterSnap.data().points <= 100) {
          const points = voterSnap.data().points || 0;
          voterSnap.ref.set({ points: points + pointsForVote, lastVotedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
        }
      }
    }
    return true;
  });

// Listens for reports changes to deactivate photo
exports.onReport = functions.firestore.document("/users/{userId}/photos/{photoId}/reports/{documentId}")
  .onWrite(async (change, context) => {
    // Grab the current value of what was written to Firestore.
    // const snap = change.after.exists ? change.after : null;

    const snap = change.after.exists ? change.after : null;

    // functions.logger.log("change", change);

    let reporterId = undefined;
    if (snap) {
      reporterId = snap.data().userId;
    }

    const userId = context.params.userId;
    const photoId = context.params.photoId;


    const photoSnap = await admin.firestore()
      .collection("users").doc(userId)
      .collection("photos").doc(photoId).get();
    photoSnap.ref.set(
      {
        active: false,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

    if (reporterId) {
      const reporterSnap = await admin.firestore()
        .collection("users").doc(reporterId).get();
      functions.logger.log("reporterSnap", reporterSnap);

      if (reporterSnap.exists) {
        // add blocked user to blocks
        const originalBlocks = reporterSnap.data().blockedUsers;
        const blocks = originalBlocks ? [...originalBlocks, userId] : [userId]
        functions.logger.log("blocks", blocks);
        reporterSnap.ref.set({ blocks }, { merge: true });
      }
    }

    return true;
  });


// Listens for photos removal to cleanup
exports.photoRemoved = functions.firestore.document("/users/{userId}/photos/{photoId}")
  .onDelete(async (snap, context) => {
    const batch = admin.firestore().batch();
    const photoId = context.params.photoId;
    const userId = context.params.userId;

    const photoObj = snap.data();

    admin.firestore()
      .collectionGroup("votes").where("photoId", "==", photoId).get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        return batch.commit();
      });
    admin.storage().bucket().file(`images/${userId}/${photoObj.imageName}`).delete();
    try {
      admin.storage().bucket().file(`images/${userId}/resized/${getResizedName(photoObj.imageName)}`).delete();
    } catch (error) {
      functions.logger.log(error);
    }
    return true;
  });


// Listens for user creation
exports.userCreated = functions.firestore.document("/users/{userId}")
  .onCreate(async (snap) => {
    const age = snap.data().age;
    const showGender = snap.data().showGender || "both";
    if (!age) {
      snap.ref.set({ complete: false }, { merge: true });
    } else {
      snap.ref.set({ complete: true }, { merge: true });
    }
    snap.ref.set({ points: 50, showGender, onBoarding: false }, { merge: true });
    return true;
  });


exports.scheduledFunctionCrontab = functions.pubsub.schedule("0 00 * * *")
  .timeZone("America/New_York") // Users can choose timezone - default is America/Los_Angeles
  .onRun(() => {
    const date = new Date();
    // Change it so that it is 7 days in the past.
    const pastDate = date.getDate() - 7;
    date.setDate(pastDate);

    const photosSnap = admin.firestore().collectionGroup("photos")
      .where("active", "==", true)
      .where("updatedAt", "<", admin.firestore.Timestamp.fromDate(date));

    photosSnap.get().then((snapshot) => {
      const batch = admin.firestore().batch();
      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, "active", false);
      });
      return batch.commit();
    });

    return null;
  });


exports.scheduledFunction = functions.pubsub.schedule("every 2 hours").onRun(() => {
  console.log("This will be run every 2 hours!");

  const date = new Date();
  // Change it so that it is 7 days in the past.
  const pastDate = date.getDate() - 7;
  date.setDate(pastDate);
  const photosSnap = admin.firestore().collectionGroup("photos")
    .where("active", "==", true)
    .where("uploadedAt", "<", admin.firestore.Timestamp.fromDate(date));

  photosSnap.get().then((snapshot) => {
    const batch = admin.firestore().batch();
    snapshot.docs.forEach((doc) => {
      const photoObj = doc.data();
      const predictions = photoObj.predictions
      if (!predictions) return
      const expressions = photoObj.expressions
      if (!expressions) return

      const sexyPrediction = predictions.find((p) => {
        p.className === "Sexy";
      }).probability || 0

      const happy = expressions.find((p) => {
        p.expression === "happy";
      }).probability || 0

      const rating = Math.min(Math.round(sexyPrediction * 5 + (Math.random() * 3) + happy * 2 + 2) / 2, 5)
      const voteObj = {
        userId: "bot",
        rate: rating,
        ratedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const newVoteRef = admin
        .firestore()
        .collection(`users/${photoObj.userId}/photos/${doc.id}/votes`)
        .doc();
      batch.set(newVoteRef, voteObj);
    });
    return batch.commit();
  });


  return null;
});

// exports.generateThumbnail = generateThumbnail.generateThumbnail;
