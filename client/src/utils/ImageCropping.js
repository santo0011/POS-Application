// ImageCropping.js
import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';


const ImageCropping = ({ open, setOpen, image, setCroppedImage, setRefImage, setCateImage }) => {

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);
    const [aspect] = useState(1 / 1);

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
        setRefImage(true)

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
        setCateImage(blob)
        const blobUrl = URL.createObjectURL(blob);

        return blobUrl;
    };


    const handleClose = () => {
        setOpen(false)
        setRefImage(true)
    }



    return (
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
                <button className='btn btn-danger p-1' onClick={handleClose}>Cancel</button>
                <button className='btn btn-success p-1' onClick={handleCrop}>Crop Image</button>
            </DialogActions>
        </Dialog>
    );
};



export default ImageCropping;