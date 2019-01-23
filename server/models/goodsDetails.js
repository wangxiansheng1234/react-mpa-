/**
 *
 * 商品详情模块
 * Created by wangpeng on 2018/3/15.
 */


import React from 'react';
import fs from 'fs';
import path from 'path';
import {renderToString} from 'react-dom/server';
import {encription} from '../../common/util/query';
import {promiseAll} from '../httpRequest';

import {GoodsDetails} from '../../common/components/goodsDetails';

let renderFullPage = (html, initStateDate, specData, hotWords) => {
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
<link href=${filePath.styles.goodsDetails} rel="stylesheet" >
<script>
window.__INITIAL_STATE__ = ${JSON.stringify(initStateDate)}
window.__INITIAL_SPEC__ = ${JSON.stringify(specData)}
window.__INITIAL_HOT__ = ${JSON.stringify(hotWords)}
</script>
</head>
<body>
<div id="container">${html}</div>
</body>
<script src="/lineLibrary/hyPlist.js" type="text/javascript"></script>
<script src=${filePath.javascript.common} type="text/javascript"></script>
<script src=${filePath.javascript.goodsDetails} type="text/javascript"></script>
<script src="/lineLibrary/goodsAreaSelecet.js" type="text/javascript"></script>
</html>
    `
};

let goodsDetails = (req, res) => {
    if (req.params.goodsItemId) {
        let timeStamp = Date.parse(new Date());
        let data = {
            areaId:0,
            cityId:0,
            goodsItemId:req.params.goodsItemId,
            strToken:0,
            strUserId:0,
            timeStamp:timeStamp,
            userId:0
        };
        //详情
        let params = {
            url: '/mobile-web-trade/ws/mobile/v1/goods/goodsInfo?sign=' + encription(data),
            method: 'post',
            params: data,
        };

        let dataSpec = {goodsItemId: req.params.goodsItemId};

        //规格
        let paramsSpec = {
            url: '/mobile-web-trade/ws/mobile/v1/goods/goodsSpec?sign=' + encription(dataSpec),
            method: 'post',
            params: dataSpec,
        };

        //热搜词
        let paramsH = {
            url: '/mobile-web-trade/ws/mobile/v1/goods/keywords',
            method: 'POST',
        };

        promiseAll([params, paramsSpec, paramsH])
            .then((date) => {
                let initStateDate = date[0];
                let spec = date[1].response.spec;
                let initHot = date[2].response.keywordList;
                let html = renderToString(<GoodsDetails initData={initStateDate.response} spec={spec} hot={initHot}/>);
                res.end(renderFullPage(html, initStateDate.response, spec, initHot));
                //手动清除内存
                timeStamp = null;
                data = null;
                params = null;
                dataSpec = null;
                paramsSpec = null;
                paramsH = null;
                initStateDate = null;
                spec = null;
                initHot = null;
                html = null;
            })
            .catch((error) => {
                res.send('服务器错误');
            });

    }
};
export {goodsDetails}


