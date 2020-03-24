const express = require('express');
// const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const crypto = require('crypto');
require('dotenv').config()
const apiImageRouter = express.Router();



s3 = new aws.S3({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_REGION,
  s3BucketEndpoint: true,
  endpoint: "http://johnc-apt-reviews.s3.amazonaws.com"
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true)
  } else {
      cb(null, false)
  }
}

// aws.config.update({
//   secretAccessKey: process.env.AWS_SECRET_KEY,
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   region: process.env.AWS_REGION
// });

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'johnc-apt-reviews',
        filename: function (req, file, cb) {
          crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
          });
        },
        key: function (req, file, cb) {
          cb(null, `${Date.now()}`); //use Date.now() for unique file keys
        },
        fileFilter: fileFilter,
        acl: 'public-read',
        contentType: function(req, file, cb) {
          cb(null, 'image/jpeg')
        },
        endpoint: 'http://johnc-apt-reviews.s3.'
    })
});

//open in browser to see upload form
// apiImageRouter.get('/', function (req, res) {
    
// });


apiImageRouter.post('/',  upload.array('file', 5), (req, res, next) => {

  // get image urls to mongodb
  // need to extract url 
  // send back in response obj to be passed into review obj, then saved to mongo


  let images = req.files.map((file) => {
    return file.location.toString();
  })
  res.send(images)
  
})

module.exports = apiImageRouter;