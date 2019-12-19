var mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  phone: String,
  email: String,
  create_time: {type: Number, default: Date.now},
  role_id: String
})

const User = mongoose.model('Users', userSchema)

module.exports = User
