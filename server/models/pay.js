/**
 *
 * 支付模块
 * Created by wangpeng on 2018/1/19.
 */


import React from 'react';
import fs from 'fs';
import path from 'path';
import {renderToString} from 'react-dom/server';
import {Pay} from '../../common/components/pay';

let renderFullPage = (html, price, orderType) => {
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
<link href=${filePath.styles.pay} rel="stylesheet" >
<script>
window._price = ${price}
window._orderType = ${JSON.stringify(orderType)}
</script>
</head>
<body>
<div id="container">${html}</div>
</body>
<script src="/lineLibrary/hyPlist.js" type="text/javascript"></script>
<script src=${filePath.javascript.common} type="text/javascript"></script>
<script src=${filePath.javascript.pay} type="text/javascript"></script>
</html>
    `
};

let pay = (req, res) => {
    //提交结算
    let html = renderToString(<Pay orderPrice={req.query.totalPrice} orderType={req.query.orderType}/>);
    res.end(renderFullPage(html, req.query.totalPrice, req.query.orderType));
    //清除内存
    html = null;
};
export {pay}


