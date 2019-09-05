// 引入node中的路径工具
const path = require('path')
// 添加vue-loader的插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// 判断当前环境是否为开发环境
const isDev = process.env.NODE_ENV === 'development' 
// 引入html-plugin
const HTMLPlugin = require('html-webpack-plugin')
// 引入webpack
const webpack = require('webpack')
// css单独打包插件 3.x版本 4.x版本不能生成hash的文件名且需要对应的beta版本 官网推荐使用MiniCssExtractPlugin
// const ExtractTextPlugin = require("extract-text-webpack-plugin")
// css单独打包插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 每次打包前清理dist文件夹
const { CleanWebpackPlugin } = require("clean-webpack-plugin");


const config = {
  // 设置目标平台为web
  target: 'web',
  // 设置入口文件
  entry: path.join(__dirname, 'src/index.js'),
  // 设置当前webpack的模式 也可以在命令中进行设置 --mode production 或者-p
  // mode: isDev?'development':'production',
  // 出口文件相关设置
  output: {
    // 出口文件路径
    path: path.join(__dirname, 'dist'),
    // 出口文件名
    filename: 'bundle.[hash:8].js'
  },
  // 模块设置，用于解析css，图片等
  module: {
    rules: [
      {
        // 匹配vue文件
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        // 匹配jsx语法
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        // 匹配图片
        test: /\.(jpg|png|jpeg|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            // 当图片大小超过1mb时进行压缩
            limit: 1024,
            // 设置图片输出名称 为初始名称+aa
            name: '[name].[ext]',
            // 设置出口文件目录
            outputPath: 'asset/images'
          }
        }]
      }
    ],
  },
  // 插件用于生产模板和各项功能
  plugins: [
    // 每次打包前清理dist文件夹 ，不能单独放置在生产环境中，否则会报错
    new CleanWebpackPlugin(),
    // 引用vue插件
    new VueLoaderPlugin(),
    // 引用html组件
    new HTMLPlugin({
      // 对html文件进行压缩
      minify: {
        // 移除属性的引号
        removeAttributeQuotes: true
      },
      // hash，避免开发中的js缓存
      hash: true
    }),
    // 使用内置插件判断webpack和js代码所处环境
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev? '"development"': '"production"'
      }
    })
  ]
}

if (isDev) {
  // 因为打包的时候要将css分离出来 所以生产环境和开发环境需要分开配置，如果只配置开发环境在公有环境进行下面的设置则会无法分离css
  config.module.rules.push(
    {
      // 匹配stylus文件
      test: /\.styl(us)?/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            // 这里设置source-map为true，因为stylus-loader和postcss-loader均会生成suorce-map，这里直接使用前面生成的suorce-map，提升编译速度
            sourceMap: true
          }
        },
        'stylus-loader'
      ]
    }
  ),
  config.devServer = {
    // 设置端口号
    port: 9000,
    // 设置主机 
    host: '0.0.0.0',
    // 服务端开启压缩
    compress: true,
    // 出现错误时，全屏显示
    overlay: {
      errors: true
    },
    // 是否每次运行dev-server都打开浏览器
    // open: true,
    // 是否每次修改代码  只对组件更新 而不是整个页面更新
    hot: true,
    // 设置访问错误地址时，自动跳到404页面
    historyApiFallback: {
      rewrites: [
        {
          from: /./,
          to: '/dist/404.html'
        }
      ]
    },
  }
  // 添加额外的配置
  config.plugins.push(
    // 4.x版本以下如果要使用组件更新，需要进行如下设置
    new webpack.HotModuleReplacementPlugin(),
    // 减少不需要的信息展示
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  //单独设置生产环境下的入口，单独打包类库
  config.entry = {
    app: path.join(__dirname, 'src/index.js'),
    vendor: ['vue']
  };
  // 生产环境下输出打包名称
  config.output.filename = 'bundle.[chunkhash:8].js';
  // 生产环境需将css分离出来
  config.module.rules.push (
    {
      test: /\.styl/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,// 替换原来的style-loader
          options: {
            // you can specify a publicPath here
            // by default it use publicPath in webpackOptions.output
            publicPath: './',
            hmr: process.env.NODE_ENV === 'development',
          }
        }, 
        'css-loader',
        {
          loader: 'postcss-loader',
          options: { sourceMap: true }
        },
        'stylus-loader'
      ]
    },
    {
      test: /\.css$/,
      use: [
        // 将原来的style-loader替换
        MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    }
  );
  config.plugins.push(
    // 4.x版本建议使用MiniCssExtractPlugin
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'styles.[chunkhash].[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    })
  );
  config.optimization = {
    splitChunks: {
      chunks(chunk) {
        // exclude `my-excluded-chunk`
        return chunk.name !== 'my-excluded-chunk';
      }
    }
  };
}

module.exports = config