const MyPlugin = require('./plugins/myPlugin.js');
const FileListPlugin = require('./plugins/fileListPlugin.js');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MinCssExtractPlugin = require('mini-css-extract-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const globAll = require('glob-all');
module.exports = {
  entry: {
    main: './src/index.js', // 默认是entry: './src/index.js', main是chunk名称，chunkName, 默认是main,'./src/index.js'是入口文件
  },
  context: path.resolve(__dirname, ''), // 设置上下文，默认是当前目录
  target: 'node', // 设置webpack打包的代码运行环境，默认是web
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.vue', '.scss', '.css', '.ts', '.jsx', '.js', '.json'], // '...'这个是webpack5特有语法，可以省略默认后缀名。
  },
  externals: {
    echarts: 'echarts',
  },
  // loader
  module: {
    rules: [
      {
        test: /index\.js$/,
        use: [
          {
            loader: './loaders/test-loader.js', // 使用的loader路径
            options: {
              changeLet: '未知数', // loader的参数
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MinCssExtractPlugin.loader,
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.(png)|(jpg)|(jpeg)|(gif)$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.resolve(__dirname, 'cache'), // 缓存目录
            },
          },
          {
            loader: './loaders/image-loader.js',
            options: {
              limit: 3000,
              filename: 'img-[contenthash:5].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(png)|(jp?eg)|(gif)|(svg)(\?.*)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 3000,
              name: 'imgs/[name].[contenthash:5].[ext]',
            },
          },
          {
            loader: 'file-loader',
            options: {
              name: 'imgs/[name].[contenthash:5].[ext]',
            },
          },
        ],
      },
    ],
    noParse: /a\.js$/, // 不需要解析的文件,内部的require()不会生效
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MinCssExtractPlugin({
      filename: '[name].[contenthash:5].css', // 打包后的文件名
    }),
    new PurgeCSSPlugin({
      // 移除未使用的css
      paths: globAll.sync([path.join(__dirname, 'src/**/*.html'), path.join(__dirname, 'src/**/*.js')]),
    }),
  ],
  stats: {
    colors: true, // 打包进度条颜色
    modules: false, // 打包进度条不显示模块信息
    children: false, // 打包进度条不显示子模块信息
  },
};
