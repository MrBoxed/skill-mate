const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');


// Set up multer storage to store file in fileSystem
const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        const outputPath = "./uploads/videos";

        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath);
        }

        cb(null, outputPath);
    },

    filename: (req, file, cb) => {

        const uniquiSuffix = Date.now() + '-' + uuidv4();
        cb(null, file.fieldname + '-' + uniquiSuffix + path.extname(file.originalname));
    }
})

const Upload = multer({
    storage: storage,
    // limits: { fileSize: 100 * 1024 * 1024 }, // Set max file size to 100MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /mp4|mkv|mov|avi/; // Allowed video formats
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only video files are allowed!'));
        }
    }
});

const CreateThumbnail = (req, res, next) => {

    // Creating thumbnail from the video
    try {
        const videoPath = req.file.path;

        // the folder path where thumbnail will be stored
        const outputPath = "uploads/thumbnails";
        const outputfilename = `thumbnail-${uuidv4()}.jpg`;

        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath);
        }

        // Generating the thumbnail
        ffmpeg(videoPath)
            .screenshot({
                timestamps: [2], // Capture a thumbnail at 2 second in the video
                filename: outputfilename,
                folder: outputPath
            })
            .on('end', () => {
                req.thumbnailUrl = `${outputPath}/${outputfilename}`;
                next();
            })
            .on('error', (err) => {
                console.error('Error in ffmpeg thumbnail generation');
                next();
            });
    }
    catch (e) {
        console.log("Create thumbnail Failed.");
    }

}

module.exports = {
    Upload,
    CreateThumbnail
}