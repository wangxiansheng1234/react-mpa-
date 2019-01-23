/**
 * Created by wangpeng on 2018/1/18.
 */

require('babel-register');
require('babel-polyfill');

const Webpack_isomorphic_tools = require('webpack-isomorphic-tools');
const project_base_path = require('path').join(__dirname, '..');
global.webpack_isomorphic_tools = new Webpack_isomorphic_tools(require('../webpack/webpack-isomorphic-tools-configuration'))
    .server(project_base_path)
    .then(() => {
        require('./app');
    });

//头两句用来是app.js支持es6的语法，主要看第三行开始的代码，可以看出引入了同构的包，然后使用构造函数来新建了一个对象，这个构造函数加载了一个文件，然后调用了server,它引用了一个路径，这个路径用来生成配置文件中的一些文件的路径，此处是用于生成webpack-assets.json，然后去引用了app.js.
