/**
 * Created by wangpeng on 2018/3/15.
 */

import React, {Component} from 'react';
import ReactDOM, {hydrate} from 'react-dom';
import {GoodsList} from '../../common/components/goodsList';

hydrate(<GoodsList/>,document.getElementById('container'));


if(process.env.NODE_ENV == 'development'){
    if(module.hot) {
        module.hot.accept();
    }
}
