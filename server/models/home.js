/**
 *
 * 首页模块
 * Created by wangpeng on 2018/1/19.
 */


import React from 'react';
import fs from 'fs';
import path from 'path';
import {renderToString} from 'react-dom/server';

import {promiseAll} from '../httpRequest';
import {encription} from '../../common/util/query';

import {Home} from '../../common/components/home';

let renderFullPage = (html, initNavi, initCategory, initHot) => {
    if(process.env.NODE_ENV == 'development'){
        global.filePath = JSON.parse(fs.readFileSync(path.join(__dirname, '../../webpack/webpack-assets.json')));
    }
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="description" content="汇银乐虎供应链（www.lehumall.com）汇集全球进口商品、进口零食、进口母婴，进口美妆，买进口商品，何须海外代购!"/>
<meta name="Keywords" content="进口商品,进口食品,进口零食,汇银乐虎,汇银乐虎全球家,乐虎,汇银乐虎,扬州电商,扬州O2O,扬州B2C,扬州B2B2C，江苏汇银电子商务有限公司,智慧社区"/>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
<link href="http://app.lehumall.com/front/images/Shortcut_114_114.png" rel="apple-touch-icon-precomposed">
<link href="http://app.lehumall.com/front/images/Shortcut_114_114.png" rel="Shortcut Icon">
<link href="${filePath.styles.home}" rel="stylesheet" >
<script>
window.navi = ${JSON.stringify(initNavi)}
window.category = ${JSON.stringify(initCategory)}
window.hot = ${JSON.stringify(initHot)}
</script>
</head>
<body>
<div id="container">${html}</div>
</body>
<script src="/lineLibrary/hyPlist.js" type="text/javascript"></script>
<script src="${filePath.javascript.common}" type="text/javascript"></script>
<script src="${filePath.javascript.home}" type="text/javascript"></script>
</html>
    `
};

let home = (req, res) => {

    //请求导航信息
    let params = {
        url: '/mobile-web-pc/ws/mobile/v1/index/getPCNagivation',
        method: 'POST',
    };

    //请求分类信息
    let data = {
        catId: 0,
        strToken: 0,
        strUserId: 0,
    };
    let paramst = {
        url: '/mobile-web-trade/ws/mobile/v1/goods/catAllList?sign=' + encription(data),
        method: 'POST',
        params: data,
    };

    //热搜词
    let paramsH = {
        url: '/mobile-web-trade/ws/mobile/v1/goods/keywords',
        method: 'POST',
    };

    promiseAll([params, paramst, paramsH])
        .then((data) => {
            let initNavi = data[0].navi;
            let initCategory = data[1].response.category;
            let initHot = data[2].response.keywordList;
            let html = renderToString(<Home navi={initNavi} category={initCategory} hot={initHot}/>);

            //设置响应文件类型
            res.writeHead(200,{'Content-Type':"text/html;charset=UTF-8"});

            res.end(renderFullPage(html, initNavi, initCategory, initHot));
            //手动清除变量内存
            initNavi = null;
            initCategory = null;
            initHot = null;
            html = null;
        })
        .catch((error) => {
            console.log(error);
        });
};
export {home}


