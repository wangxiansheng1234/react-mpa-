/**
 * Created by wangpeng on 2018/2/12.
 */

import React, {Component} from 'react';
import ReactDOM, {hydrate} from 'react-dom';

import {Home} from '../../common/components/home';

const navi= window.navi;
const category= window.category;
const _hot= window.hot;

hydrate(<Home navi={navi} category={category} hot={_hot} />,document.getElementById('container'));

if(process.env.NODE_ENV == 'development'){
    if(module.hot) {
        module.hot.accept();
    }
}
