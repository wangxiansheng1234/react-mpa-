/**
 * Created by wangpeng on 2018/3/15.
 */

import React, {Component} from 'react';
import ReactDOM, {hydrate} from 'react-dom';
import {GoodsDetails} from '../../common/components/goodsDetails';

const initState = window.__INITIAL_STATE__;
const specData = window.__INITIAL_SPEC__;
const hotWords = window.__INITIAL_HOT__;

hydrate(<GoodsDetails initData={initState} spec={specData} hot={hotWords}/>,document.getElementById('container'));

if(process.env.NODE_ENV == 'development'){
    if(module.hot) {
        module.hot.accept();
    }
}
