const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  likes: {
    type: [String],
    default: []
  }
})

module.exports = mongoose.model('StockUser', UserSchema)