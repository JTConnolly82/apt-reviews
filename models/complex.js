const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const complexSchema = new Schema({
  name: String,
  website: String,
}, {timestamps: true});

module.exports = mongoose.model('Complex', complexSchema);