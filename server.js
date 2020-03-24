const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()
const port = process.env.PORT || 8000;
const expressJwt = require('express-jwt');
const morgan = require('morgan');
const path = require("path");

app.use(express.json());
app.use(morgan('dev'));

// ... other app.use middleware 
app.use(express.static(path.join(__dirname, "client", "build")))


mongoose.set('useCreateIndex', true);


mongoose.connect(process.env.MONGODB_URI || process.env.DEVELOPMENT_ATLAS,
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


app.use("/api", expressJwt({secret: process.env.SECRET || "some secret passphrase here for local development"}));
app.use('/auth', require('./routes/auth'));
app.use("/review", require('./routes/review'));
app.use("/api/review", require('./routes/apiRouter'));
app.use("/api/reviewImages", require('./routes/apiImageRouter'));
app.use("/apartment", require('./routes/apartment'));
app.use("/api/apartment", require('./routes/aptApiRouter'));
app.use("/user", require('./routes/userRouter'));


//global error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "UnauthorizedError") {
    res.status(err.status);
  }
  return res.send({errMsg: err.message});
});


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => console.log(`running on port ${port} 😎`));