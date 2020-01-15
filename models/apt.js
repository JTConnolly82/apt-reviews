const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const aptSchema = new Schema({
  address: String,
  bedrooms: Number,
  bathrooms: Number
})

module.exports = mongoose.model('Apartment', aptSchema);