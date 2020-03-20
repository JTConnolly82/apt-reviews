const express = require('express');
// let multer = require('multer');
// let uuid = require('uuid/v4');
const apiRouter = express.Router();
const Review = require('../models/review');



apiRouter.post('/',  (req, res, next) => {
  //add users id to new obj before saving the newly created review
  
  req.body.user = req.user._id;
  // const file = req.file;
  // console.log(file)
  req.body.userName = req.user.name;
  const newReview = new Review(req.body)
  // const image = req.file.path;
  console.log(`new review -->  ${newReview}`)
  // const url = req.protocol + '://' + req.get('host')
  // req.body.images = url + '/public/' + req.file.fileName
  newReview.save((err, savedReview) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    console.log(savedReview.createdAt);
    return res.status(201).send(savedReview);
  })
})

apiRouter.put('/', (req, res, next) => {
  Review.findOneAndUpdate({
        _id: req.body.reviewId
    }, 
    req.body, 
    {new: true}, 
    (err, updatedReview) => {
    if (err) {
      res.status(500)
      return next(err)
    }
    console.log(updatedReview.updatedAt)
    return res.send(updatedReview)
  })
})

apiRouter.delete('/:_id', (req, res, next) => {
  Review.findOneAndDelete({
          _id: req.params._id,
          user: req.user._id
    },
   (err, deletedReview) => {
    if (err) {
      res.status(500);
      return next(err)
    }
    return res.send(deletedReview);
  })
})

module.exports = apiRouter