const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');


userRouter.get('/:userId', (req, res, next) => {
  User.find({_id: req.params.userId}, (err, user) => {
    if (err) {
      res.status(500);
      return next(err);
    };
    return res.status(200).send(user);
  });
});

module.exports = userRouter;