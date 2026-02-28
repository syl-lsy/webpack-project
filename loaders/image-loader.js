const loaderUtils = require('loader-utils');
const path = require('path');
function loader(source) {
  //   console.log(source);
  // console.log(this._compilation.options);

  let content = '';
  const { limit = 1000, filename = '[contenthash:5].[ext]' } = loaderUtils.getOptions(this);
  // const publicPath = this._compilation.options.output.path;

  if (Buffer.byteLength(source) < limit) {
    content = toBase64.call(this, source); // 这里的this.resourcePath是图片的路径 this是webpack提供的上下文对象
  } else {
    content = getFileName.call(this, filename, source);
  }
  return `module.exports = \`${content}\``;
}
loader.raw = true; // ****表示source是Buffer类型,处理二进制类型****
module.exports = loader;

/**
 * 将Buffer数据转换为Base64编码的Data URL
 * @param {Buffer} buffer - 需要转换的Buffer数据
 * @returns {string} 返回Data URL格式的字符串
 */
function toBase64(buffer) {
  //   解析文件后缀名
  let ext = path.extname(this.resourcePath);
  // 移除后缀名中的点号
  ext = ext.replace(/^\./, '');
  // 返回Data URL格式的字符串，包含MIME类型和Base64编码的数据
  return `data:image/${ext};base64,${buffer.toString('base64')}`;
}

function getFileName(name, source) {
  const filename = loaderUtils.interpolateName(this, name, { content: source });
  this.emitFile(filename, source);
  return filename;
}
