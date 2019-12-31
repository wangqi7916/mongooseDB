// Bearer <access_token>
const jwt = require('jsonwebtoken')
const { keySecret } = require('../utils/config')
const verifyToken = function (req, res, next) {
  const bearerHeader = req.headers['authorization']
  if (bearerHeader !== undefined) {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken
    try {
      jwt.verify(req.token, keySecret, (err) => {
        if (err) {
          res.send({
            status: 2,
            message: 'token失效'
          })
        } else {
          next()
        }
      })
    } catch(err) {
      console.log(err)
    }
  } else {
    res.send({
      status: 2,
      message: 'token失效'
    })
  }
}

module.exports = verifyToken