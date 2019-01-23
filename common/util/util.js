/**
 * 公共方法
 * Created by niwei on 2018/2/28.
 */

//check电话号码
let checkmobile = (mobile) => {
    if (!mobile) {
        return false;
    }
    return /^1[34578]\d{9}$/.test(mobile);
};

//格式化时间戳
let FormatTime = (time) => {
    time = new Date(parseInt(time));
    let year = time.getFullYear();
    let month = time.getMonth() + 1 < 10 ? '0' + ( time.getMonth() + 1) : time.getMonth() + 1 ;
    let date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    let hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours() ;
    let minute = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    let second = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
};

//数组去重
let NoRepeat = (array) => {
    let n = []; //一个新的临时数组
//遍历当前数组
    for (let i = 0; i < array.length; i++) {
        if (n.indexOf(array[i]) == -1) n.push(array[i]);
    }
    return n;
};

//强制保留2位小数点
let toDecimal2 = (x) => {
    let f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    let fl = Math.round(x * 100) / 100;
    let s = fl.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
};

//将数组按照规则重新分组
let SplitArray = (lens,data) => {
    let result = [];
    for(let i=0,len=data.length;i<len;i+=lens){
        result.push(data.slice(i,i+lens));
    }
    return result;
};

export {checkmobile,FormatTime,NoRepeat,toDecimal2, SplitArray}