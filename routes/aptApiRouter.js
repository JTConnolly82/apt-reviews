const express = require('express');
const aptApiRouter = express.Router();
const Apartment = require('../models/apt');



aptApiRouter.post('/', (req, res, next) => {
  //add users id to new obj before saving the newly created apartment
  const newApartment = new Apartment(req.body);
  console.log(`new apartment -->  ${newApartment}`)
  newApartment.save((err, savedApartment) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    return res.status(201).send(savedApartment);
  })
})

aptApiRouter.put('/:aptId', (req, res, next) => {
  Apartment.findByIdAndUpdate(req.params.aptId, req.body, {new: true}, (err, updatedApt) => {
    if (err) {
      res.status(500)
      return next(err)
    }
    return res.send(updatedApt)
  })
  // res.send(`put on ${req.params.aptId}`)
})

aptApiRouter.delete('/:aptId', (req, res, next) => {
  Apartment.findByIdAndRemove(req.params.aptId, (err, deletedApt) => {
    if (err) {
      res.status(500);
      return next(err)
    }
    const response = {
      messsage: "review deleted",
      id: deletedApt._id
    }
    return res.status(200).send(response);
  })
  // res.send(`delete on ${req.params.aptId}`)
})


module.exports = aptApiRouter