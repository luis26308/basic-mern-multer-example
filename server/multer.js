import {GridFsStorage} from 'multer-gridfs-storage'
import multer from 'multer'
import 'dotenv/config'

const MONGO_URI = 'your mongo uri'

const storage = new GridFsStorage({
    url: MONGO_URI, 
    options: { useNewUrlParser: true, useUnifiedTopology: true }, // Recommended options for MongoDB driver
    file: (req,  file)=> {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            // If it is an image, save to the 'photos' bucket with a custom filename
            return {
                bucketName: "images", // It was "uploads" in your code, changed to 'photos' based on your comment
                filename: `${Date.now()}_${file.originalname}`, // Custom filename with timestamp
            };
        } else {
            // Files not matching the expected types are saved in the default bucket with a new filename
            return {
                bucketName: "other", // This is an example, you might not have an 'other' bucket setup
                filename: `${Date.now()}_${file.originalname}`
            };
        }
    }
})

// export const upload = multer();
export const upload = multer({storage});