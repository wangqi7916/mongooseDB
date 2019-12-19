const express = require('express')
const jwt = require('jsonwebtoken')
const md5 = require('blueimp-md5')
const { keySecret } = require('../utils/config')
const verifyToken = require('../utils/tokenYz')
const User = require('../models/userModels')
const Role = require('../models/roleModels')


// 得到路由器对象config
const router = express.Router()

// 用户登录
router.post('/api/login', (req, res) => {
  const { username, password } = req.body
  User.findOne({username, password: md5(password)})
    .then(user => {
      if (!user) {
        return res.send({
          message: '用户名或密码不正确',
          status: 0
        })
      } else {
        jwt.sign({
          username
        }, keySecret , { expiresIn: 60 * 60 }, (err, token) => {
          if (user.role_id) {
            Role.findOne({_id: user.role_id})
              .then(role => {
                user._doc.role = role
                res,send({
                  token,
                  data: user,
                  message: '登陆成功',
                  status: 1
                })
              })
          } else {
            user._doc.role = { menus: [] }
            res.send({
              token,
              data: user,
              message: '登陆成功',
              status: 1
            })
          }
        })
      }
    })
  .catch(error => {
    console.error('登陆异常', error)
    res.send({status: 0, message: '登陆异常, 请重新尝试'})
  })
})

// 获取所有用户
router.get('/api/getUserAll', verifyToken, async (req, res) => {
  const data = await User.find()
  const roles = await Role.find()
  res.send({
    data,
    roles,
    status: 1
  })
})

// 更新用户
router.post('/api/updateUser', verifyToken, (req, res) => {
  const user = req.body
  User.findOneAndUpdate({_id: user._id}, user)
    .then(oldUser => {
      const data = Object.assign(oldUser, user)
      res.send({
        status: 1,
        authData,
        data
      })
    })
    .catch(error => {
      console.error('更新用户异常', error)
      res.send({status: 0, message: '更新用户异常, 请重新尝试'})
    })
})

// 删除用户
router.post('/api/deleteUser', verifyToken, (req, res) => {
  const { userId } = req.body
  User.deleteOne({_id: userId})
    .then(doc => {
      res.send({
        status: 1, 
        message: '删除成功', 
        authData
      })
    })
})

// 添加用户
router.post('/api/addUser', verifyToken, (req, res) => {
  // 获取请求参数
  const { username, password } = req.body
  // 先判断用户是否存在
  User.findOne({username})
    .then(user => {
      // 存在
      if (user) {
        res.send({status: 0, message: '此用户已经存在'})
        return new Promise(() => {})
      } else {
        return User.create({...req.body, password: md5(password || 'node')})
      }
    })
    .then(user => {
      res.send({
        status: 1,
        data: user
      })
    })
    .catch(error => {
      console.error('注册异常', error)
      res.send({status: 0, message: '添加用户异常, 请重新尝试'})
    })
})

// 角色
// 添加角色
router.post('/api/addRole', verifyToken, (req, res) => {
  const { roleName } = req.body
  Role.create({name: roleName})
    .then(role => {
      res.send({
        status: 1,
        data: role
      })
    })
    .catch(error => {
      console.error('添加角色异常', error)
      res.send({status: 0, message: '添加角色异常, 请重新尝试'})
    })
})

// 获取角色
router.post('/api/addRole', verifyToken, (req, res) => {
  Role.find()
    .then(roles => {
      res.send({status: 1, data: roles})
    })
    .catch(error => {
      console.error('获取角色列表异常', error)
      res.send({status: 0, message: '获取角色列表异常, 请重新尝试'})
    })
})

// 更新角色
router.post('/api/updateRole', verifyToken, (req, res) => {
  const role = req.body
  role.auth_time = Date.now()
  Role.findOneAndUpdate({_id: role._id}, role)
    .then(oldRole => {
      res.send({status: 1, data: {...oldRole._doc, role}})
    })
    .catch(error => {
      console.error('更新角色异常', error)
      res.send({status: 0, message: '更新角色异常, 请重新尝试'})
    })
})

module.exports = router