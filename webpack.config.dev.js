const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const distFile = 'distFileDev';
const distPath = path.join(__dirname, distFile);
const webpack = require('webpack');
if (!fs.existsSync(distFile)) {
  fs.mkdirSync(distFile);
}
module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  watch: true, // 开启监听
  devtool: 'source-map', // 生成source-map
  output: {
    filename: '[name].[hash:5].js',
    path: path.join(distPath),
    library: '[name]',
    libraryTarget: 'var', // 有var, window,this,global,commonjs2,commonjs,amd,umd
  },
  devServer: {
    open: true,
    port: 8080,
    hot: true, // 模块热更新出口
  },
  // Plugins
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'devIndex.html',
    }),
    new webpack.HotModuleReplacementPlugin(), // 启动模块热更新
    new webpack.DllReferencePlugin({
      manifest: require('./dll/jquery-manifest.json'),
    }),
    new webpack.DllReferencePlugin({
      manifest: require('./dll/lodash-manifest.json'),
    }),
  ],
  optimization: {
    minimize: true, // 压缩代码
    minimizer: [new TerserPlugin(), new OptimizeCssAssetsPlugin()],
  },
});
