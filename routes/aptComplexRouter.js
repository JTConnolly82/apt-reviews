const express = require('express');
const aptComplexRouter = express.Router();
const Complex = require('../models/complex');


// aptComplexRouter.get('/', (req, res, next) => {
//   Complex.find( (err, complexes) => {
//     if (err) {
//       res.status(500);
//       return next(err);
//     };
//     return res.status(200).send(complexes);
//   });
// });

aptComplexRouter.get('/:complexId', (req, res, next) => {
  console.log('apt complex req',req.params.complexId)
  Complex.findOne({_id: req.params.complexId}, (err, complex) => {
    if (err) {
      res.status(500);
      return next(err);
    };
    return res.status(200).send(complex);
  });
});

module.exports = aptComplexRouter;