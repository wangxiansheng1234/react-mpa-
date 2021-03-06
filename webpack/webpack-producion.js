const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const Webpack_isomorphic_tools_plugin = require('webpack-isomorphic-tools/plugin');
const path = require('path');
const glob = require('glob');

//插件定义
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//清除文件夹清除文件夹public
const CleanWebpackPlugin = require('clean-webpack-plugin');

const webpack_isomorphic_tools_plugin =
    new Webpack_isomorphic_tools_plugin(require('./webpack-isomorphic-tools-configuration'))
        .development();

//定义路径
let srcDir = path.resolve(process.cwd(), 'client');

//html_webpack_plugins 定义
let html_plugins = function () {
    let entryHtml = glob.sync(srcDir + '/*.html');
    let r = [];
    let entriesFiles = entries();
    for (let i = 0; i < entryHtml.length; i++) {
        let filePath = entryHtml[i];
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        let conf = {
            template: filePath,
            filename: filename + '.html'
        };
        //如果和入口js文件同名
        if (filename in entriesFiles) {
            conf.inject = 'body';
            conf.chunks = ['common', filename];
        }
        //如果页面中不存在引入js
        else {
            conf.inject = "";
            conf.chunks = [];
        }
        //跨页面引用，如pageA,pageB 共同引用了common-a-b.js，那么可以在这单独处理
        //if(pageA|pageB.test(filename)) conf.chunks.splice(1,0,'common-a-b')
        r.push(new HtmlWebpackPlugin(conf))
    }
    return r
};

//入口文件定义
let entries = function () {
    let jsDir = path.resolve(srcDir, 'scripts');
    let entryFiles = glob.sync(jsDir + '/*.{js,jsx}');
    let map = {};

    for (let i = 0; i < entryFiles.length; i++) {
        let filePath = entryFiles[i];
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        map[filename] = filePath;
    }
    return map;
};


module.exports = {
    context: path.join(__dirname, '..'),
    entry: Object.assign(entries(), {
        // 用到什么公共lib（例如zepto.js），就把它加进vendor去，目的是将公用库单独提取打包
        'common': ['react', 'react-dom']
    }),
    output: {
        path: `${__dirname}/../public`,
        publicPath: '/public/',
        filename: 'scripts/[name].[hash:5].js',
        chunkFilename: 'scripts/[name].[hash:5].min.js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ["babel-loader"],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use:[
                        {
                            loader: 'css-loader',
                            options:{
                                minimize: true //css压缩
                            }
                        }, 'postcss-loader'
                    ]
                })
            },
            {
                test: webpack_isomorphic_tools_plugin.regular_expression('images'),
                loader: 'url-loader?limit=10240&name=images/[hash:8].[name].[ext]', // any image below or equal to 10K will be converted to inline base64 instead
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.scss', 'css']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production') //定义生产环境
            }
        }),
        new CommonsChunkPlugin({
            name: 'common',
            minChunks: Infinity
        }),
        new ExtractTextPlugin('styles/[hash:5].[name].min.css'),
        new webpack.optimize.UglifyJsPlugin({ // js、css都会压缩
            compress: {
                warnings: false,
                drop_debugger: true,  //去除项目里的debug
                drop_console: true, //去除代码里的console.log
            },
            output: {
                comments: false,
            }
        }),
        webpack_isomorphic_tools_plugin,
        new CleanWebpackPlugin(['public'], {
            //清除dist文件 root为根目录下
            root: process.cwd()
        }),
    ].concat(html_plugins())
}