// Bearer <access_token>
const jwt = require('jsonwebtoken')
const { keySecret } = require('../utils/config')
const verifyToken = function (req, res, next) {
  const bearerHeader = req.headers['authorization']
  if (bearerHeader !== undefined) {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken
    jwt.verify(req.token, keySecret, async(err) => {
      if (err) {
        res.send({
          status: 2,
          message: 'token失效'
        })
      }
    })
    next()
  } else {
    res.send({
      status: 2,
      message: 'token失效'
    })
  }
}

module.exports = verifyToken