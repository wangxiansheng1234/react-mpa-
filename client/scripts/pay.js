/**
 * 支付客户端容器入口
 * Created by wangpeng on 2018/3/20.
 */

import React, {Component} from 'react';
import ReactDOM, {hydrate} from 'react-dom';

import {Pay} from '../../common/components/pay';

const price = window._price;
const orderType = window._orderType;

hydrate(<Pay orderPrice={price} orderType={orderType} />, document.getElementById('container'));

if(process.env.NODE_ENV == 'development'){
    if(module.hot) {
        module.hot.accept();
    }
}
