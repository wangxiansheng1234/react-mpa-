/**
 * Created by wangpeng on 2018/2/12.
 */

import React, {Component} from 'react';
import ReactDOM, {hydrate} from 'react-dom';
import {Cart} from '../../common/components/cart';


hydrate(<Cart />,document.getElementById('container'));

if(process.env.NODE_ENV == 'development'){
    if(module.hot) {
        module.hot.accept();
    }
}
