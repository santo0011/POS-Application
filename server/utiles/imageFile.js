const fs = require('fs-extra');


// ====================== categoryImgMoveFunc ========================
const categoryImgMoveFunc = () => {

    const sourceDirectory = `./uploads/temp`;
    const destinationDirectory = `./uploads/categoryImg`;

    fs.readdir(sourceDirectory, (err, files) => {
        if (err) {
            console.error('Error reading source directory:', err);
            return;
        }

        files.forEach(file => {
            const sourcePath = `${sourceDirectory}/${file}`;
            const destinationPath = `${destinationDirectory}/${file}`;

            fs.move(sourcePath, destinationPath, err => {
                if (err) {
                    console.error(`Error moving file ${file}:`, err);
                } else {
                    console.log(`File moved successfully`);
                }
            });
        });


    });
}


// ====================== categoryDeleteFunction ========================
const tempImageRemove = (categoryImage) => {
    const directory = `./uploads/temp/${categoryImage}`;
    fs.remove(directory, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        } else {
            console.log('File removed form temp');
        }
    });
}


// ====================== categoryDeleteFunction ========================
const categoryDeleteFunction = (delteCataId) => {
    const directory = `./uploads/categoryImg/${delteCataId}`;

    fs.remove(directory, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        } else {
            console.log('File deleted successfully');
        }
    });
}



// ====================== productImgMoveFunc ========================
const productImgMoveFunc = () => {

    const sourceDirectory = `./uploads/temp`;
    const destinationDirectory = `./uploads/productImg`;

    fs.readdir(sourceDirectory, (err, files) => {
        if (err) {
            console.error('Error reading source directory:', err);
            return;
        }

        files.forEach(file => {
            const sourcePath = `${sourceDirectory}/${file}`;
            const destinationPath = `${destinationDirectory}/${file}`;

            fs.move(sourcePath, destinationPath, err => {
                if (err) {
                    console.error(`Error moving file ${file}:`, err);
                } else {
                    console.log(`File moved successfully`);
                }
            });
        });


    });
}


// ====================== productDeleteFunction ========================
const productDeleteFunction = (delteCataId) => {
    const directory = `./uploads/productImg/${delteCataId}`;

    fs.remove(directory, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        } else {
            console.log('File deleted successfully');
        }
    });
}


module.exports = {
    categoryImgMoveFunc,
    tempImageRemove,
    categoryDeleteFunction,
    productImgMoveFunc,
    productDeleteFunction
}
