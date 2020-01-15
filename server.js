const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()
const port = process.env.PORT || 8000;
const expressJwt = require('express-jwt');
const morgan = require('morgan');

app.use(express.json());
app.use(morgan('dev'));
//global error handler




mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/reviewsdb',
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
.then(()=> console.log("Connected to DB"))
.catch(err => console.error(err));

 //gatekeeper checks token on requests to /api, 
 //if theres a token it'll create req.user obj
 //if theres not a token, it'll throw "UnauthorizedError"
app.use("/api", expressJwt({secret: process.env.SECRET}));
app.use('/auth', require('./routes/auth'));
// app.use("/review", require("./routes/review"));
app.use("/review", require('./routes/review'));
app.use("/api/review", require('./routes/apiRouter'));
app.use("/apartment", require('./routes/apartment'));
app.use("/api/apartment", require('./routes/aptApiRouter'));
app.use("/user", require('./routes/userRouter'));

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "UnauthorizedError") {
    res.status(err.status);
  }
  return res.send({errMsg: err.message});
});

app.listen(port, () => console.log(`running on port ${port} 😎`));