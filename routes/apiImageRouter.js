const express = require('express');
// const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
require('dotenv').config()
const apiImageRouter = express.Router();
// const Image = require('../models/image');


s3 = new aws.S3();


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
          cb(null, file.originalname); //use Date.now() for unique file keys
        },
        acl: 'public-read-write',
        contentType: function(req, file, cb) {
          cb(null, 'image/jpeg')
        }
    })
});

//open in browser to see upload form
// apiImageRouter.get('/', function (req, res) {
    
// });


apiImageRouter.post('/',  upload.array('file', 10), (req, res, next) => {

  // get image urls to mongodb
  // need to extract url 
  // send back in response obj to be passed into review obj, then saved to mongo


  let images = req.files.map((file) => {
    return file.location.toString();
  })
  console.log('sent images', images)
  res.send(images)
  
})

module.exports = apiImageRouter;