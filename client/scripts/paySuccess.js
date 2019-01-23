/**
 * Created by wangpeng on 2018/2/12.
 */

import React, {Component} from 'react';
import ReactDOM, {hydrate} from 'react-dom';
import {PaySuccess} from '../../common/components/paySuccess';

const initState = window.__INITIAL_STATE__;

hydrate(<PaySuccess initData={initState}/>,document.getElementById('container'));

if(process.env.NODE_ENV == 'development'){
    if(module.hot) {
        module.hot.accept();
    }
}
