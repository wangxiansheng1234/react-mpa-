import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack-config';

const app = new express();
const port = 3001;
const compiler = webpack(webpackConfig);
const child_process = require('child_process');


compiler.plugin('compilation',compilation=>{
    compilation.plugin('html-webpack-plugin-after-emit', (data, cb)=> {
        webpackHotMiddleware(compiler).publish({ action: 'reload' });
        cb();
    });
});

app.use(webpackDevMiddleware(compiler,{
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
    },
    hot: true,
    noInfo: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    inline: true,
    progress: true,
}));

app.use(express.static(path.join(__dirname,'../public')));

app.use(webpackHotMiddleware(compiler,{
    path: '/__webpack_hmr'
}));

app.use('*',(req,res,next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});


app.listen(port,err=>{
    if(err){
        console.error(err);
    } else {
        console.info(`the webpack server has been listened at port: ${port}`)
    }
});