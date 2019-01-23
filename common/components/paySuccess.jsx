/*
* 支付成功模块
* */

import React, {Component} from 'react';

import '../styles/common.css';
import '../styles/paySuccess.css';
import {encription, parseQueryString} from "../util/query";
import {ApiPost, getTimeStamp} from "../config/api";
import {getUser} from '../util/store';

//加载组件
import {HeaderTop} from '../commonviews/header-top';
import {FooterNav} from '../commonviews/footer';

class PaySuccess extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orderDetail: {},
            goodsName: '',//商品名称
        };

        //綁定事件
        this.viewOrder = this.viewOrder.bind(this);
        this.continueShopping = this.continueShopping.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        let that = this;

        //获取user
        this.user = getUser();

        //获取url参数
        this.queryAgr = parseQueryString(window.location.href);

        //获取订单数据
        that.apiRequest();

    }

    componentWillUnmount() {
    }

    //支付成功接口数据请求
    apiRequest() {
        let that = this;
        let data = {
            strUserId: that.user.userId,
            strToken: that.user.token,
            orderCode: that.queryAgr.orderType,
            timeStamp: getTimeStamp(),
        };
        let param = {
            url: '/mobile-web-trade/ws/mobile/v1/order/order?sign=' + encription(data),
            method: 'post',
            params: data,
        };
        ApiPost(param)
            .then((data) => {
                if (data.code == 1) {
                    this.setState({
                        orderDetail: data.response.order,
                    });
                    if (data.response.order.orderDetails != '') {
                        this.setState({
                            goodsName: data.response.order.orderDetails[0].goodsName,
                        })
                    }
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }

    //查看订单
    viewOrder(e) {
        e.stopPropagation();
        window.location.href = '/orderManage.html';
    }


    //继续购物
    continueShopping(e) {
        e.stopPropagation();
        window.location.href = "/";
    }


    render() {
        let that = this;
        const {orderDetail, goodsName} = this.state;

        return (
            <div className="page">
                {/*顶部*/}
                <HeaderTop/>

                <div className="content">
                    <div className="logo w"><img src={require('../images/home_image_logo.png')}/></div>
                    <div className="tab w">
                        <div className="success">
                            <div className="success-item">
                                <img src={require('../images/success.png')}/>
                                <em>你已成功支付{orderDetail.totalPrice}元&nbsp;!</em>
                            </div>
                            <ul className="order">
                                <li>
                                    <span>订单号&nbsp;:&nbsp;</span>
                                    <i>{orderDetail.orderCode}</i>
                                </li>
                                <li>
                                    <span>商品名称&nbsp;:&nbsp;</span>
                                    <i>{goodsName}</i>
                                </li>
                                <li>
                                    <span>订单金额&nbsp;:&nbsp;</span>
                                    <i>{orderDetail.totalGoodsPrice}元</i>
                                </li>
                                <li>
                                    <span>实际支付&nbsp;:&nbsp;</span>
                                    <i className="col">{orderDetail.totalPrice}元</i>
                                </li>
                            </ul>
                            <div className="btn">
                                <p onClick={(e) => that.viewOrder(e)}>查看订单</p>
                                <p onClick={(e) => that.continueShopping(e)} className="p-active p-two">继续购物</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/*footer*/}
                <FooterNav/>
            </div>
        )
    }

}

export {PaySuccess}

