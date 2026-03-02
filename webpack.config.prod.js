const { merge } = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.config.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const WebpackBundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressWebpackPlugin = require('compression-webpack-plugin');
module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: 'none', // 生产环境去除sourceMap
  output: {
    filename: '[name].[contenthash:8].js', // 打包后的文件名
    path: path.resolve(__dirname, 'dist'), // 打包后的文件存放路径
    // clean: true, // 打包前清空dist文件夹 只适用webpack5，webpack4使用clean-webpack-plugin
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
    new webpack.DllReferencePlugin({
      manifest: require('./dll/jquery-manifest.json'),
    }),
    new webpack.DllReferencePlugin({
      manifest: require('./dll/lodash-manifest.json'),
    }),
    new WebpackBundleAnalyzerPlugin(),
    new CompressWebpackPlugin({
      test: /\.(js|css)$/, // 匹配文件名
      threshold: 10240, // 对超过5kb的数据压缩
      // minRatio: 0.8, // 压缩率
      filename: '[path].gz', // 压缩后的文件名
    }),
  ],
  // 自动分包
  optimization: {
    minimize: true, // 压缩代码
    minimizer: [new TerserPlugin(), new OptimizeCssAssetsPlugin()], // js压缩使用TerserPlugin，css压缩使用OptimizeCssAssetsPlugin
    splitChunks: {
      chunks: 'all',
      minSize: 0, // 分包的最小体积
      // 缓存组
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          minChunks: 1,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true, // 如果当前模块已经被打包过，则复用
        },
      },
    },
  },
});
