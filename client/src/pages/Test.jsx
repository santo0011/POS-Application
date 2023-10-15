import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Cropper from 'react-easy-crop';

import Dialog from '@mui/material/Dialog';
import Drawer from '@mui/material/Drawer';
import DialogActions from '@mui/material/DialogActions';


const Test = () => {
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);
    const [croppedImage, setCroppedImage] = useState();
    const [aspect] = useState(4 / 3); // Set your desired aspect ratio


    const [open, setOpen] = useState(false);


    const handleImageChange = (e) => {

        setOpen(true)

        if (e.target.files && e.target.files.length > 0) {
            const selectedImage = e.target.files[0];
            const objectUrl = URL.createObjectURL(selectedImage);
            setImage(objectUrl);
        }
    };

    const onCropChange = (newCrop) => {
        setCrop(newCrop);
    };

    const onZoomChange = (newZoom) => {
        setZoom(newZoom);
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    };

    const handleCrop = () => {
        if (croppedArea && image) {
            const imageObject = new Image();
            imageObject.src = image;
            const canvas = document.createElement('canvas');
            canvas.width = croppedArea.width;
            canvas.height = croppedArea.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(
                imageObject,
                croppedArea.x,
                croppedArea.y,
                croppedArea.width,
                croppedArea.height,
                0,
                0,
                croppedArea.width,
                croppedArea.height
            );
            const baseImage = canvas.toDataURL('image/png');
            setCroppedImage(base64ToBlob(baseImage));
        }

        setOpen(false)

    };

    const base64ToBlob = (croppedImage) => {
        const base64Parts = croppedImage.split(",");
        const base64Encoded = base64Parts[1];
        const binaryData = atob(base64Encoded);
        const byteNumbers = new Array(binaryData.length);

        for (let i = 0; i < binaryData.length; i++) {
            byteNumbers[i] = binaryData.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });
        const blobUrl = URL.createObjectURL(blob);

        return blobUrl;
    };

    const handleDialogclose = () => {
        setOpen(false)
    }

    return (
        <Layout>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-4">

                        <Dialog open={open}>

                            {image && (
                                <div style={{ position: 'relative', width: '400px', height: '300px' }}>
                                    <Cropper
                                        image={image}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={aspect}
                                        onCropChange={onCropChange}
                                        onZoomChange={onZoomChange}
                                        onCropComplete={onCropComplete}
                                    />
                                </div>
                            )}
                            <DialogActions>
                                <button className='btn btn-danger' onClick={handleDialogclose}>Cancel</button>
                                <button className='btn btn-success' onClick={handleCrop}>Crop Image</button>

                            </DialogActions>
                        </Dialog>

                        <div>
                            <input type="file" onChange={handleImageChange} accept="image/*" />

                            {croppedImage ? (
                                <>
                                    <img src={croppedImage} alt="Cropped Image" />
                                </>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};


export default Test;