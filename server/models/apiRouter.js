/**
 * express主路由
 * Created by wangpeng on 2018/3/19.
 */

import Express from 'express';

import { home } from './home';
import { login } from './login';
import { register } from './register';
import { cart } from './cart';
import { order } from './order';
import { pay } from './pay';
import { personal } from './personal';
import { passwordBack } from './passwordBack';
import { goodsDetails } from './goodsDetails';
import { goodsList } from './goodsList';
import { orderManage } from './orderManage';
import { orderDetails } from './orderDetails';
import { paySuccess } from './paySuccess';

const router = Express.Router();

/*
 * 路由配置
 * */
//首页
router.get('/', home);

//购物车
router.get('/cart.action', cart);

//提交订单
router.get('/shopping/order.html', order);

//登录
router.get('/login.html', login);

//注册
router.get('/register.html', register);

//个人资料
router.get('/personal.html',personal);

//修改密码
router.get('/passwordBack.html',passwordBack);

//商品详情
router.get('/00000000/:goodsItemId?.html',goodsDetails);

//商品列表
router.get('/goodsList.html',goodsList);

//订单管理列表
router.get('/orderManage.html',orderManage);

//订单详情
router.get('/orderDetails.html',orderDetails);

//支付页面
router.get('/cashier/index.action', pay);

//支付成功页面
router.get('/paySuccess.html', paySuccess);

//404页面
router.get('*',(req,res)=> {
    res.sendFile( __dirname + '/' + '404.html' );
});

export {router}
