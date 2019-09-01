// 对处理后的css代码进行优化

// 引入自动添加后缀插件
const autoprefixer = require('autoprefixer')

// 优化css处理后的代码
module.exports = {
  plugins: [
    autoprefixer()
  ]
}