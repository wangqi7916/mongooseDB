const mongoose = require('mongoose')
const roleSchema = new mongoose.Schema({
  name: { // 角色名称
    type: String,
    required: true
  },
  auth_name: String, // 授权人
  auth_time: Number,  // 授权时间
  create_time: { // 创建时间
    type: Number,
    default: Date.now
  },
  menus: Array // 权限数组
})

// 定义Model(与集合对应, 可以操作集合)
const Role = mongoose.model('roles', roleSchema)

module.exports = Role
