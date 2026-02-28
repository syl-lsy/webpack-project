class FileListPlugin {
  constructor(filename = 'fileList.txt') {
    this.filename = filename;
  }
  apply(compiler) {
    compiler.hooks.emit.tap('FileListPlugin', compilation => {
      console.log(compilation.assets);
      const assetsList = compilation.assets;
      const fileList = [];
      for (let key in assetsList) {
        let content = `【${key}】
            大小: ${assetsList[key].size() / 1000} kb`;
        fileList.push(content);
      }
      const str = fileList.join('\n');
      compilation.assets[this.filename] = {
        source() {
          return str;
        },
        size() {
          return str.length;
        },
      };
    });
  }
}

module.exports = FileListPlugin;
