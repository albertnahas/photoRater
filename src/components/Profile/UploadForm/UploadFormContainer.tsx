import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';

import firebase from '../../../config';
import { getResizedName } from '../../../utils/utils';
import { State } from '../../../types/state';
import { UploadForm } from './UploadForm';

const storage = firebase.storage();

export var UploadFormContainer: FC<Props> = function (props) {
    const [imageAsFile, setImageAsFile] = useState<any>();
    const [imageAsUrl, setImageAsUrl] = useState<any>('');
    const [showToGender, setShowToGender] = useState('both');
    const [ageRange, setAgeRange] = useState([18, 37]);
    const [uploading, setUploading] = useState<any>(false);
    const user = useSelector((state: State) => state.user.value);

    const handleImageAsFile = (e: any) => {
        const image = e.target.files[0];
        setImageAsFile((imageFile: any) => image);
        setImageAsUrl({ imgUrl: URL.createObjectURL(image) });
    };

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
                                    uploadedAt:
                                        firebase.firestore.FieldValue.serverTimestamp()
                                });
                            setUploading(false);
                            props.onCancel();
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
            onCancel={props.onCancel}
        />
    );
};

interface Props {
    onCancel: () => void;
}
