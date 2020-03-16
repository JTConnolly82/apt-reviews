// const express = require('express');
// const GridFsStorage = require('multer-gridfs-storage');
// require('dotenv').config()
// const apiImageRouter = express.Router();
// const Image= require('../models/image');


// const storage = new GridFsStorage({
//   url: process.env.MONGODB_URI || process.env.DEVELOPMENT_ATLAS,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err)
//         }
//         const filename = file.originalname
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'images',
//         }
//         resolve(fileInfo)
//       })
//     })
//   },
// })

// const upload = multer({ storage })

// apiImageRouter.post('/',  (req, res, next) => {
//   //add users id to new obj before saving the newly created review
  
//   req.body.user = req.user._id;
//   // const file = req.file;
//   // console.log(file)
//   req.body.userName = req.user.name;
//   // const image = req.file.path;
//   console.log(`new review -->  ${newReviewImages}`)
//   // const url = req.protocol + '://' + req.get('host')
//   // req.body.images = url + '/public/' + req.file.fileName
//   newReviewImages.forEach((reviewImageObj) => {
//     const newReviewImage = new Image(reviewImageObj)
//   })
//   newReviewImages.save((err, savedReviewImages) => {
//     if (err) {
//       res.status(500);
//       return next(err);
//     }
//     console.log(savedReviewImages.createdAt);
//     return res.status(201).send(savedReview);
//   })
// })

// module.exports = apiImageRouter;