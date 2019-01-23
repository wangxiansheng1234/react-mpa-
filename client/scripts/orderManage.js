/**
 * Created by wangpeng on 2018/3/15.
 */

import React, {Component} from 'react';
import ReactDOM, {hydrate} from 'react-dom';
import {OrderManager} from '../../common/components/orderManage';

hydrate(<OrderManager/>,document.getElementById('container'));

if(process.env.NODE_ENV == 'development'){
    if(module.hot) {
        module.hot.accept();
    }
}
