/**
 * Created by niwei on 2018/2/26.
 */

import md5 from 'md5';


//把url的参数部分转化成json对象
export const  parseQueryString = (url) =>{
    let reg_url = /^[^\?]+\?([\w\W]+)$/,
        reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
        URL = unescape(url),
        arr_url = reg_url.exec(URL),
        ret = {};
    if (arr_url && arr_url[1]) {
        let str_para = arr_url[1], result;
        while ((result = reg_para.exec(str_para)) != null) {
            ret[result[1]] = result[2];
        }
    }
    return ret;
};


//md5加密 ,验签
export const encription = (data) => {

    let Keyboard = '00BE62201707188DE8A63ZGH66D46yTXNREG1423';
    let mdName = 'key=' + Keyboard + '&body=' + JSON.stringify(data);
    return md5(mdName);

};