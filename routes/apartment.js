const express = require('express');
const apartmentRouter = express.Router();
const Apartment = require('../models/apt');


// Todo.find({ user: req.user._id }, (err, todos) => {
//   if (err) return res.status(500).send(err);
//   return res.send(todos);
// });

apartmentRouter.get('/', (req, res, next) => {
  Apartment.find((err, apartments) => {
    if (err) {
      res.status(500);
      return next(err);
    };
    return res.status(200).send(apartments);
  });
});


apartmentRouter.get('/:aptId', (req, res, next) => {
  Apartment.findOne({_id: req.params.aptId}, (err, apartment) => {
    if (err) {
      res.status(500);
      return next(err);
    };
    return res.status(200).send(apartment);
    });
  });

  apartmentRouter.get('/wherecomplex/:complexId', (req, res, next) => {
    console.log('req params', req.params)
    Apartment.find({complex: req.params.complexId}, (err, apartments) => {
      if (err) {
        res.status(500);
        return next(err);
      };
      console.log('getting apartments')
      return res.status(200).send(apartments);
    });
  });


module.exports = apartmentRouter