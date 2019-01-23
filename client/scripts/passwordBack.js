/**
 * Created by wangpeng on 2018/2/12.
 */

import React, {Component} from 'react';
import ReactDOM, {hydrate} from 'react-dom';
import {PasswordBack} from '../../common/components/passwordBack';

const initState = window.__INITIAL_STATE__;

hydrate(<PasswordBack initData={initState}/>,document.getElementById('container'));

if(process.env.NODE_ENV == 'development'){
    if(module.hot) {
        module.hot.accept();
    }
}
