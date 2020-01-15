const express = require('express');
const reviewRouter = express.Router();
const Review = require('../models/review');



reviewRouter.get('/', (req, res, next) => {
  Review.find( (err, reviews) => {
    if (err) {
      res.status(500);
      return next(err);
    };
    return res.status(200).send(reviews);
  });
});

// reviewRouter.post('/', (req, res, next) => {
//   //add users id to new obj before saving the newly created review
//   req.body.user = req.user._id;
//   const newReview = new Review(req.body)
//   console.log(`new review -->  ${newReview}`)
//   newReview.save((err, savedReview) => {
//     if (err) {
//       res.status(500);
//       return next(err);
//     }
//     return res.status(201).send(savedReview);
//   })
// })

// Apartment.findOne({_id: req.params.aptId}, (err, apartment) => {
//   console.log(apartment)
//   if (err) {
//     res.status(500);
//     return next(err);
//   };
//   return res.status(200).send(apartment);
// });

reviewRouter.get('/:aptId', (req, res, next) => {
  Review.find({apt: req.params.aptId}, (err, review) => {
    if (err) {
      res.status(500);
      return next(err);
    };
    return res.status(200).send(review);
  });
  })


module.exports = reviewRouter;