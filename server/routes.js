import express from 'express'
import mongoose from 'mongoose'
import { upload } from './multer.js'
import Image from './ImageModel.js'
import { GridFSBucket } from 'mongodb'

const router = express.Router()
const conn = mongoose.connection;
let gfs

conn.once('open', () => {
    // Ensure that the connection to the database is open before using GridFSBucket
    gfs = new GridFSBucket(conn.db, {
        bucketName: 'images' // replace 'yourBucketName' with your actual bucket name
    });
    console.log('GridFS Bucket has been initialized');
});


router.route('/').get((req, res) => {
    res.json({ message: 'Hello from server!' })
})

router.route('/upload').post(upload.single('image'), (req, res) => {
    let filename = req.file.filename
    // console.log(req.file)
    let newImage = new Image({ filename })
    newImage.save().then((image) => {
        // console.log(image)
        res.json(image)
    }).catch(err => {
        console.log(err)
    })
})

router.route('/image/:filename').get(async (req, res)=> {
    const filename = req.params.filename;
    console.log('image requested:', filename)
    console.log('gfs:', gfs)

    const cursor = await gfs.find({filename})
    const files = await cursor.toArray()
    console.log('files:', files)
    if (!files || files.length === 0) {
        return res.status(404).json({
            err: 'no files exist'
        })
    }
    const file = files[0];
    const readStream = gfs.openDownloadStream(file._id);
    readStream.on('error', error => {
        console.error('Error streaming file:', error);
        res.status(500).json({ error: 'Error streaming file' });
    });
    readStream.pipe(res);
})





export default router