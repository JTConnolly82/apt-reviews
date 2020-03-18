const express = require('express');
// const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
require('dotenv').config()
const apiImageRouter = express.Router();
// const Image = require('../models/image');





s3 = new aws.S3();

console.log('s3', s3);

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_REGION
});

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'johnc-apt-reviews',
        metadata: function (req, file, cb) {
          cb(null, Object.assign({}, req.body));
        },
        key: function (req, file, cb) {
          console.log('req in multer', req)
          console.log('fileinsidemulter', file);
          cb(null, file.originalname); //use Date.now() for unique file keys
      }
    })
});

//open in browser to see upload form
// apiImageRouter.get('/', function (req, res) {
    
// });


apiImageRouter.post('/',  upload.any(), (req, res, next) => {

  if (err) {
      res.status(500);
      return next(err);
    };
    return res.status(200);
 
})

module.exports = apiImageRouter;