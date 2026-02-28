class MyPlugin {
  // 提供注册事件的方法
  apply(compiler) {
    //   事件注册
    compiler.hooks.beforeRun.tap('MyPlugin', compilation => {
      console.log('MyPlugin done');
    });
  }
  q;
}

module.exports = MyPlugin;
