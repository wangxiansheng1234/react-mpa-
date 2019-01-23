/**
 *
 * api路由
 * Created by wangpeng on 2018/1/18.
 */

import path from 'path';
import express from 'express';
import compression  from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fs from 'fs';


//实例化类
let app = express();

//设置常驻内存，保存ssr中  css  js的对象文件 程序执行，内存不会消失
if(process.env.NODE_ENV == 'production'){
    global.filePath = JSON.parse(fs.readFileSync(path.join(__dirname, '../webpack/webpack-assets.json')));
}

//引入路由
import {router} from './models/apiRouter';

//调用gzip压缩  对文本信息进行压缩
app.use(compression());

//中间件 解析body cookie
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//设置本地静态文件访问
app.use('/public', express.static(path.join(__dirname, '../public'), {maxAge: 3600000}));
app.use('/lineLibrary', express.static(path.join(__dirname, '../lineLibrary'), {maxAge: 3600000}));

//路由
app.use('/', router);

//监听端口号  开发环境改为 3000 生产环境改为80
let server = app.listen(3000, (err) => {
    if (err) {
        console.error(err);
    }
    else {
        console.info('the express server has been listened : 3000/');
    }
});

