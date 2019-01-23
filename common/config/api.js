/*
 *  api请求服务端数据
 * */

import fetch from 'isomorphic-fetch';
require('es6-promise').polyfill();

import {http_url} from '../../httpconfig/http_host';

//post 请求
let ApiPost = (params) => {

    return fetch(http_url() + params.url, //url
        {
            method: 'POST',
            headers: { // 请求头（可以是Headers对象，也可是JSON对象）
                'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify(params.params),
        })
        .then(response => {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then((data) => {
            return data;
        })
};

//get 请求
let ApiGet = (params) => {
    let param = '';
    if (params.params) {
        //拼接参数
        let paramsArray = [];
        Object.keys(params.params).forEach(key => paramsArray.push(key + '=' + params.params[key]));
        paramsArray.map((item, index) => {
            if (index == 0) {
                return param += '?' + item + '&';
            }
            else if (index == paramsArray.length - 1) {
                return param += item;
            }
            else {
                return param += item + '&';
            }
        });
    }
    return fetch(http_url() + params.url + (params.params ? param : ''), //url
        {method: 'GET',})
        .then(response => {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
};

// 时间戳
let getTimeStamp = () => {
    return Date.parse(new Date());
};

export {ApiPost, ApiGet, getTimeStamp};

