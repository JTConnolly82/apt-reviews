const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const aptSchema = new Schema({
  street_address: String,
  apt_number: String,
  city: String,
  state: String,
  bedrooms: Number,
  bathrooms: Number,
  complex: {
    type: Schema.Types.ObjectId,
    ref: 'Complex',
    required: false
  }
}, {timestamps: true});

module.exports = mongoose.model('Apartment', aptSchema);