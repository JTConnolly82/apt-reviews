const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  apt: {
    type: Schema.Types.ObjectId,
    ref: 'Apartment',
    required: true
  },
  aptAddress: String,
  description: String,
  wouldRecommend: Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: String,
  // image: {
  //   type: String
  // }
  
}, {timestamps: true})


module.exports = mongoose.model('Review', reviewSchema);