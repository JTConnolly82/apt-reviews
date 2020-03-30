const express = require('express');
const apiComplexRouter = express.Router();
const Complex = require('../models/complex');

apiComplexRouter.post('/', (req, res, next) => {
  console.log('request body', req.body)
  Complex.findOne({name: req.body.name}, function (err, existingComplex) {
    if (err) {
      console.log('in error handler aptcomplex find')
      res.status(500);
      return next(err);
    }
    if (existingComplex) {
      console.log('existing complex', existingComplex)
      return res.status(200).send(existingComplex);
    }
      const newAptComplex = new Complex({name: req.body.name, website: req.body.website})
      console.log('new complex', newAptComplex)
      newAptComplex.save((err, savedAptComplex) => {
        if (err) {
          console.log('in error handler complex save')
          res.status(500);
          return next(err);
        }
        return res.status(201).send(savedAptComplex);
      })
    console.log('im here')
  })
})

// apiComplexRouter.get('/', (req, res, next) => {
//   Complex.find((err, aptComplexes) => {
//     if (err) {
//       res.status(500);
//       return next(err);
//     };
//     return res.status(200).send(aptComplexes);
//   });
// });


// apiComplexRouter.get('/:complexId', (req, res, next) => {
//   Complex.findOne({name: req.params.complexId}, (err, aptComplex) => {
//     if (err) {
//       res.status(500);
//       return next(err);
//     };
//     return res.status(200).send(aptComplex);
//   });
//   });

module.exports = apiComplexRouter;