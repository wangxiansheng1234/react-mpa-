/**
 * get userId
 * Created by niwei on 2018/3/13.
 */

import store from 'store';

//获取user
let getUser = () => {
    let userName = store.get("user");
    if (userName) {
        let user = {
            userId: userName.userId,
            token: userName.token,
        };
        return user;
    }
};


export {getUser}