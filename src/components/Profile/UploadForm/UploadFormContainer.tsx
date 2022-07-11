import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import firebase from '../../../config';
import { getResizedName } from '../../../utils/utils';
import { State } from '../../../types/state';
import { UploadForm } from './UploadForm';
import * as nsfwjs from './nsfwjs';
// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
import '@tensorflow/tfjs';
import * as faceapi from 'face-api.js';
import { FaceExpressions } from 'face-api.js';

const storage = firebase.storage();
faceapi.loadSsdMobilenetv1Model('/models');
faceapi.loadFaceExpressionModel('/models');

export var UploadFormContainer: FC<Props> = function (props) {
    const [imageAsFile, setImageAsFile] = useState<any>();
    const [imageAsUrl, setImageAsUrl] = useState<any>('');
    const [showToGender, setShowToGender] = useState('both');
    const [predictions, setPredictions] =
        useState<Array<nsfwjs.predictionType>>();
    const [expressions, setExpressions] = useState<
        {
            expression: string;
            probability: number;
        }[]
    >();
    const [ageRange, setAgeRange] = useState([18, 37]);
    const [loading, setLoading] = useState<any>(false);
    const [uploading, setUploading] = useState<any>(false);
    const [error, setError] = useState<string>();
    const user = useSelector((state: State) => state.user.value);

    const handleImageAsFile = async (e: any) => {
        const image = e.target.files[0];
        setImageAsFile((imageFile: any) => image);
        setImageAsUrl({ imgUrl: URL.createObjectURL(image) });
        const img = document.createElement('img');
        img.src = URL.createObjectURL(image);

        nsfwjs
            .load()
            .then(function (model: any) {
                // Classify the image
                return model.classify(img);
            })
            .then(function (predictions: Array<nsfwjs.predictionType>) {
                setPredictions(predictions);
                console.log('Predictions: ', predictions);
                if (
                    (predictions &&
                        predictions.find((p: nsfwjs.predictionType) => {
                            p.className === 'Porn';
                        })?.probability) ||
                    0 > 0.8
                ) {
                    setError('The photo looks inappropriate');
                }
            });
        detectFace(img.src);
    };

    async function detectFace(url: string) {
        setLoading(true);
        const image = await faceapi.fetchImage(url);
        console.log(image instanceof HTMLImageElement); // true
        // displaying the fetched image content
        const myImg = document.createElement('img');
        myImg.src = image.src;
        const detection = await faceapi
            .detectSingleFace(
                image,
                await new faceapi.SsdMobilenetv1Options({ minConfidence: 0.6 })
            )
            .withFaceExpressions();
        console.log(detection);
        if (!detection) {
            setError('No face detected');
        } else {
            console.log('detection: ', detection.expressions.asSortedArray());

            setExpressions(detection.expressions.asSortedArray());
        }
        setLoading(false);
    }

    const handlePhotoSubmit = (e: any) => {
        e.preventDefault();
        // async magic goes here...
        if (!imageAsFile || imageAsFile === '') {
            console.error(
                `not an image, the image file is a ${typeof imageAsFile}`
            );
        } else {
            const uploadTask = storage
                .ref(`/images/${user?.uid}/${imageAsFile?.name}`)
                .put(imageAsFile);
            uploadTask.on(
                'state_changed',
                (snapShot: any) => {
                    // takes a snap shot of the process as it is happening
                    setUploading(true);
                },
                (err: any) => {
                    // catches the errors
                    console.log(err);
                },
                () => {
                    // gets the functions from storage refences the image storage in firebase by the children
                    // gets the download url then sets the image from firebase as the value for the imgUrl key:
                    const resizedImageName = getResizedName(imageAsFile?.name);
                    storage
                        .ref(`images/${user?.uid}`)
                        .child(imageAsFile?.name)
                        .getDownloadURL()
                        .then((fireBaseUrl: string) => {
                            setImageAsUrl((prevObject: any) => ({
                                ...prevObject,
                                imgUrl: fireBaseUrl
                            }));
                            firebase
                                .firestore()
                                .collection(`users/${user?.uid}/photos`)
                                .add({
                                    imageName: imageAsFile?.name,
                                    resizedImageName,
                                    imageUrl: fireBaseUrl,
                                    userId: user?.uid,
                                    showTo: showToGender,
                                    ageRange,
                                    expressions: expressions || [],
                                    predictions: predictions || [],
                                    active: true,
                                    uploadedAt:
                                        firebase.firestore.FieldValue.serverTimestamp()
                                })
                                .catch((err: any) => {
                                    console.log(err);
                                    setError('Error while uploading photo');
                                });
                            setUploading(false);
                            props.onCancel();
                        })
                        .catch((err: any) => {
                            console.log(err);
                            setError(err.message || err);
                        });
                }
            );
        }
    };

    const handleShowToGenderChange = (event: any) => {
        setShowToGender(event.target.value);
    };

    const minDistance = 10;
    const handleAgeRangeChange = (
        event: any,
        newValue: any,
        activeThumb: any
    ) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setAgeRange([
                Math.min(newValue[0], ageRange[1] - minDistance),
                ageRange[1]
            ]);
        } else {
            setAgeRange([
                ageRange[0],
                Math.max(newValue[1], ageRange[0] + minDistance)
            ]);
        }
    };

    return (
        <UploadForm
            ageRange={ageRange}
            handleAgeRangeChange={handleAgeRangeChange}
            showToGender={showToGender}
            handleShowToGenderChange={handleShowToGenderChange}
            handleImageAsFile={handleImageAsFile}
            handlePhotoSubmit={handlePhotoSubmit}
            imageAsUrl={imageAsUrl}
            uploading={uploading}
            loading={loading}
            onCancel={props.onCancel}
            error={error}
        />
    );
};

interface Props {
    onCancel: () => void;
}
