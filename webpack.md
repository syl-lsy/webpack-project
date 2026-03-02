### webpack4与webpack5的区别
1.webpack5新增了一个模块联邦的功能，可以共享模块，可以跨项目共享模块，可以解决微前端的问题
2.资源模块Assets模块，不需要webpack4的url-loader,file-loader,raw-loader等 分别替换成了asset/inline, asset/resource, asset/source
3.持久化缓存，将缓存写入磁盘，提高读写和编译速度
4.Tree-shaking的增强，能更好更精准的找到未使用的代码，最大程度的减小文件的体积。



### 模块化，工程化和组件化
1.模块化： 模块化是组件化和工程化的基础，没有模块化就没有组件化和工程化，主要是用来解决全局污染以及依赖混乱的问题。
2.工程化：主要解决了开发者在开发环境和生产环境的矛盾，在开发环境中，开发者希望代码足够的细分详细，代码结构更加的规范，方便调试和开发，而在生产环境开发者希望代码足够的压缩，混淆，优化体积，工程化就是解决这个问题，它的出现使得开发者在开发环境可以更舒适的写代码，不必花精力在生产环境打包上。
3.组件化：组件化是工程化的一个分支，主要是解决代码复用的问题，组件化使得代码的复用性更高，维护性更高，可读性更高，组件化是工程化的一个分支，不是必须的，但是有了组件化，工程化会更容易，更简单。使得前端能够做更加复杂的业务功能。

### webpack的编译过程
1.将入口文件的所有依赖进行读取，生成依赖块chunk,每个chunk对应一个入口文件
2.构建所有依赖模块（1）模块文件 ->> (2)判断是否加载过，加载过则结束，否则继续 ->> 读取文件内容 ->> 生成AST抽象语法树 ->> 将依赖模块存储在dependencies中 ->> 替换依赖函数 ->> 保存转换后的代码
3.产生chunk assets 资源列表
4.将所有的chunk assets 合并成一个总的资源列表。
5.可以根据Node内部的fs模块，将资源列表写入到文件系统。

### webpack的loader和plugin的区别
1.loader：loader是webpack中一个非常重要的概念，它用于对模块的源代码进行转换。loader可以将文件从不同的语言（如TypeScript）转换为JavaScript，或者将内联图像转换为data URL。loader可以链式调用，每个loader可以对源代码进行一次转换，最终将源代码转换为webpack可以理解的JavaScript代码。
2.plugin：plugin是webpack的另一个重要概念，它用于在webpack构建过程中执行特定的任务。plugin可以用于执行各种任务，如打包优化、资源管理和环境变量注入等。plugin是通过webpack提供的API来实现的，可以用于扩展webpack的功能。
### webpack中的特殊的配置
1.module.noParse：用于指定哪些模块文件（这个文件一定要是没有依赖其他文件）不需要被webpack解析，可以加快构建速度。一般用于指定大型库如jquery等，因为它们不包含其他依赖，不需要被解析。


### webpack的优化
1.构建性能 (1)减少模块依赖的解析noParse (2) 对loader的三种优化1.exclude排除不需要加载的模块 2.cache-loader缓存loader 3.thread-loader(loader开启多线程)
2.传输性能
3.运行性能 // 不涉及webpack

### webpack手动分包思路
1.创建webpack.config.dll.js文件配置
```js
const path = require('path');
const webpack = require('webpack');
entry {
    lodash: 'lodash',
    jquery: 'jquery'
},
output: {
  path: path.resolve(__dirname, 'dll'),
  filename: '[name].dll.js',
  library: '[name]'
},
plugins:[new webpack.DllPlugin({
    path: path.resolve(__dirname, 'dll/[name]-manifest.json'),
    name: '[name]'
})]
```
2.在webpack.config.js中引入dll
```js
plugins: [
    new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./dll/lodash-manifest.json')
    }),
    new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./dll/jquery-manifest.json')
})
]
```
3. 在index.html中引入dll文件夹上的文件
```html
<script src="./dll/lodash.dll.js"></script>
<script src="./dll/jquery.dll.js"></script>
```


### webpack自动分包思路
1.使用webpack中的SplitChunksPlugin插件
```js
optimization: {
    splitChunks: {
        chunks: 'all',
        minSize: 30000, // 当模块大于30kb时，才会被抽离出来
        minChunks: 1, // 当模块被引用1次以上时，才会被抽离出来
        maxAsyncRequests: 5, // 最大异步请求数， 默认5
        maxInitialRequests: 3, // 最大初始化请求数，默认3
        automaticNameDelimiter: '.', // 自动命名分隔符
        cacheGroups: {
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10 // 优先级
            },
            default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true // 如果该模块已经被打包过，复用已经打包过的模块
            }
    }
}
}
```

### webpack实现代码压缩，tree-shaking, 懒加载方式
1.代码压缩：使用TerserPlugin插件压缩js 使用OptimizeCssAssetsPlugin插件压缩css
```js
optimization: {
    minimize: true, // 生产环境中默认是true
    minimizer: [
        new TerserPlugin({
            test: /\.js(\?.*)?$/i,
            parallel: true,
            terserOptions: {
                compress: {
                    drop_console: true, // 去除console
                    pure_funcs: ['console.log']
                }
            }
        }),
        new OptimizeCssAssetsPlugin()
    ]
}
```

2.tree-shaking：去除无效代码及未使用的代码，但是只能静态分析出模块有没有用当使用动态加载方式如：import('').then()这种形式时tree-shaking将失效。
```js
export function getResult() {...} // 尽量使用export{...}方式导出，
import {} from './b.js' // 尽量使用import {} from './b.js'方式导入
```
3.懒加载：当需要使用某个模块时，才去加载这个模块，可以加快首屏加载速度，使用import()函数实现懒加载
```js
(async function() {
 const getResult = await import('./b.js')
 getResult.getResult()
})()

```
动态导入会使得tree-shaking失效可以在自己的项目目录下建一个导出模块，import(自己项目的模块)
```js
// ./b.js
export const getResult = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('hello world')
        }, 1000)
    })
}
// index.js
import('./b.js').then((module) => {
    module.getResult
})
```
### webpack的gzip压缩
1.使用compression-webpack-plugin插件
```js
const CompressionWebpackPlugin = require('compression-webpack-plugin');
plugins: [
    new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240, // 只有大小大于10kb的文件才会被压缩
        minRatio: 0.8, // 只有压缩比小于0.8的文件才会被压缩
        deleteOriginalAssets: false // 是否删除源文件
    })
]
```
### webpack解决路径问题使用publicPath
1.在webpack.config.js中配置
```js
output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash].js',
    publicPath: '/'
}
```
2.在index.html中引入资源时使用publicPath
```html
<script src="/js/main.js"></script>
```
### webpack内置插件
1.DefinePlugin：用于定义全局变量，可以在代码中直接使用这些变量，而不需要通过import等方式引入。
```js
const webpack = require('webpack');
new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
})
```
2.BannerPlugin：用于在打包后的文件头部添加注释，可以用于添加版权信息、版本号等。
```js
const webpack = require('webpack');
new webpack.BannerPlugin('This is my webpack project')
```
3.ProvidePlugin：用于自动加载模块，当使用某个模块时，会自动加载指定的模块。
```js
const webpack = require('webpack');
new webpack.ProvidePlugin({
    $: 'jquery',
    _: 'lodash'
})
```
4.HotModuleReplacementPlugin：用于实现热更新，可以在不刷新页面的情况下更新模块。
```js
const webpack = require('webpack');
devServer: {
    hot: true // 需要配合其使用
}
new webpack.HotModuleReplacementPlugin()
```
5.DllPlugin：用于将第三方库打包成单独的文件，可以加快打包速度。
```js
const webpack = require('webpack');
new webpack.DllPlugin({
    path: path.resolve(__dirname, 'dll/[name]-manifest.json'),
    name: '[name]'
})
```
6.DllReferencePlugin：用于引用已经打包好的第三方库，可以加快打包速度。
```js
const webpack = require('webpack');
new webpack.DllReferencePlugin({
    manifest: require('./dll/jquery-manifest.json')
})