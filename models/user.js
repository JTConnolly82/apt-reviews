const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  email: String,
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }]
});

//pre save hook to encrypt pw 
userSchema.pre("save", function(next) {
  const user = this;
  if (!user.isModified("password")) return next()
  bcrypt.hash(user.password, 10, (err, hashedPassword) => {
    if (err) {
      return next(err)
    }
    //overwrite users plain text pw with hashed pw
    user.password = hashedPassword
    //move on to the .save() in the auth/signup route
    next()
  })
});

//methods
//comparing the encrypted password to the users password attempts
userSchema.methods.checkPassword = function(passwordAttempt, callback) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) => {
    if (err) return callback(err)
    callback(null, isMatch)
  })
}

// removing the password from the user object before sending it to the frontend
userSchema.methods.withoutPassword = function() {
    //this === user object
    const user = this.toObject();
    delete user.password
    return user
}


module.exports = mongoose.model('User', userSchema);