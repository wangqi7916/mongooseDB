var express = require('express')
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
var { keySecret } = require('./utils/config')
var app = express()

app.use((req, res, next) => {
  // 设置是否运行客户端设置 withCredentials
  // 即在不同域名下发出的请求也可以携带 cookie
  res.header("Access-Control-Allow-Credentials",true)
  // 第二个参数表示允许跨域的域名，* 代表所有域名  
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS') // 允许的 http 请求的方法
  // 允许前台获得的除 Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma 这几张基本响应头之外的响应头
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  if (req.method == 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

const { User } = require('./models')

app.use(bodyParser.urlencoded({extended:false}));//解析 x-www-form-urlencoded
app.use(bodyParser.json());//无法演示 解析json数据依赖于urlencoded模块 必须同时应用

// 获取所有用户
app.get('/api/getUserAll', verifyToken, (req, res) => {
  jwt.verify(req.token, keySecret, async(err, authData) => {
    if (err) {
      res.sendStatus(403)
    } else {
      const data = await User.find()
      return res.send({
        data,
        authData,
        status: 1
      })
    }
  })
})

// Bearer <access_token>
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization']
  if (bearerHeader !== undefined) {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken
    next()
  } else {
    res.sendStatus(403)
  }
}

// 用户登录
app.post('/api/login', async(req, res) => {
  const user = await User.findOne({
    username: req.body.username
  })

  if (!user) {
    return res.send({
      message: '用户不存在',
      status: 0
    })
  }

  const isPass = (req.body.password == user.password)

  if (!isPass) {
    return res.send({
      message: '密码不正确',
      status: 0
    })
  } else {
    jwt.sign({
      username: req.body.username
    }, keySecret , { expiresIn: 60 * 60 }, (err, token) => {
      return res.send({
        token,
        message: '登陆成功',
        status: 1
      })
    })
  }
})

// 用户注册
app.post('/api/register', async(req, res) => {
  const data = {
    username: req.body.username,
    password: req.body.password
  }
  try {
    await User.create(data)
    return res.send({
      message: '注册成功',
      status: 1
    })
  } catch (error) {
    return res.status(422).send({
      message: '注册失败',
      status: 0
    })
  }
  
})

app.listen(3000, function(){
  console.log('http://127.0.0.1:3000')
})