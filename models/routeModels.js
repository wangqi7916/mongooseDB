const mongoose = require('mongoose')
const routeSchema = new mongoose.Schema({
  authName: { // 路由名称
    type: String,
    require: true
  },
  path: { // 路由路径
    type: String,
    require: true
  },
  isPublic: {
    type: Boolean
  },
  children: Array,
  isLeaf: { // 是否只有一层
    type: Boolean
  },
  parentName: String, // 父级名称
  create_time: { // 创建时间
    type: Number,
    default: Date.now
  },
})

const Route = mongoose.model('routes', routeSchema)

module.exports = Route