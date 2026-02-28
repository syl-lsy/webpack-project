const loaderOptions = require('loader-utils');

module.exports = function (source) {
  console.log('test-loader');
  const options = loaderOptions.getOptions(this); // 这里的this指的是webpack的上下文
  console.log(options);
  const reg = new RegExp(options.changeLet, 'g');
  const result = source.replace(reg, 'let');
  return result;
};
