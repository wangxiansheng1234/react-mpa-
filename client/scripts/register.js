/**
 * 注册客户端入口
 * Created by wangpeng on 2018/2/12.
 */

import React, {Component} from 'react';
import ReactDOM, {hydrate} from 'react-dom';
import {Register} from '../../common/components/register';

hydrate(<Register />,document.getElementById('container'));

if(process.env.NODE_ENV == 'development'){
    if(module.hot) {
        module.hot.accept();
    }
}
