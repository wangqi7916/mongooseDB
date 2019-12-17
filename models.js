var mongoose = require('mongoose')

var Schema = mongoose.Schema;

mongoose.connect('mongodb://127.0.0.1:27017/users', { useNewUrlParser: true, useUnifiedTopology: true })

const userSchema = new Schema({
  username: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  }
})
const User = mongoose.model('Users', userSchema)

module.exports = { User }