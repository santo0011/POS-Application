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
const categoryDeleteFunction = (categoryImage) => {
    const directory = `./uploads/temp/${categoryImage}`;
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
    categoryDeleteFunction
}
