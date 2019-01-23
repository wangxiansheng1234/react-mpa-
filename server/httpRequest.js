/**
 * Created by wangpeng on 2018/1/20.
 * node请求第三方接口返回数据
 */

import request from 'request';

import fetch from 'isomorphic-fetch';

import {http_url} from '../httpconfig/http_host';

//post请求
let postRequest = (params, callback) => {
    return request(
        {
            url: http_url() + params.url,
            method: params.method,
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: params.params ? params.params : null,
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                callback(body);
            }
        })
};

//fetch请求
let Fetch = (params) => {
    return fetch( http_url() + params.url,
        {
            method: params.method,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(params.params)
        })
        .then((response) => {
            if (response.status == 200) {
                return response.json();
            }
        })
        .then((result) => {
            return result;
        })
        .catch((error) => {
            throw new Error("Bad response from server");
        });
};

let promiseAll = (arrayPromise) => {
    let promiseArray = [];
    arrayPromise.map((item, index) => {
        let promise = Fetch(item, index);
        promiseArray.push(promise);
    });
    return Promise.all(promiseArray)
        .then((data) => {
            return data;
        })
        .catch((error) => {
            throw new Error("Bad response from server");
        })
};

export {postRequest, promiseAll}
