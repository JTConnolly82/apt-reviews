const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let imageSchema = new mongoose.Schema({
  img:  { 
    data: Buffer, 
    contentType: String 
  },
    description: String,
    review_id: String
}, {timestamps: true});

module.exports = mongoose.model('Image', imageSchema);