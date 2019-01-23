/*
 * 支付模块页面容器入口
 * */

import React, {Component} from 'react';

import '../styles/common.css';
import '../styles/pay.css';

//引入公共组件
import {HeaderTop} from '../commonviews/header-top';
import {FooterNav} from '../commonviews/footer';
import {CopyRight} from '../commonviews/copyRight';
import {PopWinodw} from '../commonviews/popup-window';

//引入公共Js
import {toDecimal2} from '../util/util';
import {encription} from '../util/query';
import {ApiPost,ApiGet} from '../config/api';

class Pay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            payStyle: 1, // 1 支付宝 2  微信支付
            wechat: false, //微信支付弹出微信二维码
            erweima: null, //二维码图片
            cancelqd: false, //二维码是否失效
            warningShow: false, //警告提示窗
            popupTip: {
                title: '',
                leftBtn: '',
                rightBtn: '',
                btnShow: false,
            }, //警告提示窗
        };

        //事件绑定
        this.goIndex = this.goIndex.bind(this);
        this.changePay = this.changePay.bind(this);
        this.paySubmit = this.paySubmit.bind(this);
        this.refreshOrder = this.refreshOrder.bind(this);
        this.cancel = this.cancel.bind(this);
        this.goOrder = this.goOrder.bind(this);
    }

    //回到首页
    goIndex(e) {
        e.stopPropagation();
        window.location.href = '/';
    }

    //改变支付方式
    changePay(e, payStyle) {
        e.stopPropagation();
        this.setState({
            payStyle: payStyle,
        })
    }

    //提交支付
    paySubmit(e) {
        e.stopPropagation();
        let that = this;
        let {payStyle} = this.state;
        const {orderType} = this.props;
        let data = {
            orderType: payStyle,
            orderNo: orderType,
        };
        let param = {
            url: '/mobile-web-pay/ws/mobile/v1/scan/scanPay?sign=' + encription(data),
            params: data,
        };
        ApiPost(param)
            .then((data) => {
                if (data.code == 1) {
                    if(payStyle == 1){
                        $('body').append(data.response.qrCode);
                    }
                    else if(payStyle == 2){
                        this.setState({
                            wechat: true,
                            erweima: data.response.qrCode,
                        },() => {
                            that.setOrderTime();
                        })
                    }
                }
                else {
                    this.setState({
                        warningShow: true,
                        popupTip: {
                            title: data.msg,
                            knowTitle: '进入订单管理',
                            leftBtn: '',
                            rightBtn: '',
                            btnShow: false,
                        }
                    });
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }

    //定时校验订单状态
    setOrderTime(){
        let that = this;
        this.checkOrderTime = setInterval(() => {
            that.checkOrder();
        }, 3000);
    }

    //检查订单是否已经失效或者已经完成支付
    checkOrder(){
        let that = this;
        let {payStyle} = this.state;
        const {orderType} = this.props;
        let data = {
            orderCode: orderType,
            payType: payStyle,
        };
        let param = {
            url: '/mobile-web-pay/ws/mobile/v1/scan/scanPayQuery',
            params: data,
        };
        ApiGet(param)
            .then((data) => {
                if(data.code == 4001){
                    clearInterval(that.checkOrderTime);
                    window.location.replace('/paySuccess.html?orderType=' + orderType) ;
                }
                else if(data.code == 3002){
                    clearInterval(that.checkOrderTime);
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }

    //刷新支付二维码
    refreshOrder(e){
        e.stopPropagation();
        clearInterval(this.checkOrderTime);
        this.paySubmit(e);
    }

    //取消弹窗
    cancel(){
        this.setState({
            warningShow: false,
            popupTip: {
                title: '',
                knowTitle: '',
                leftBtn: '',
                rightBtn: '',
                btnShow: false,
            }, //警告提示窗
        })
    }

    //去订单管理页面
    goOrder(){
        window.location.replace('/orderManage.html');
    }

    componentDidMount() {

    }

    render() {

        const {orderPrice, orderType} = this.props;
        const {payStyle, wechat, erweima, cancelqd, warningShow, popupTip} = this.state;

        return (
            <div className="page">

                <HeaderTop/>

                {/*支付信息*/}
                <div className="pay-content">

                    {/*logo信息*/}
                    <div className="hy-logo">
                        <i className="hy-logo-view" onClick={(e) => this.goIndex(e) }></i>
                    </div>

                    {/*支付信息*/}
                    <div className="pay-msg">
                        <div className="pay-order">
                            <p>订单提交成功，请尽快支付!</p>
                            <span>订单号:<em>{orderType}</em></span>
                            <i>请您在24小时内完成支付，否则订单会被自动取消</i>
                        </div>
                        <div className="pay-price">
                            应付金额:<em>￥<i>{toDecimal2(orderPrice)}</i></em>
                        </div>
                    </div>

                    {/*支付方式*/}
                    {
                        !wechat ?
                            <div className="pay-style">
                                <h3 className="item-title">支付方式</h3>
                                <ul className="fixed">
                                    <li className={payStyle == 1 ? 'active' : '' }
                                        onClick={(e) => this.changePay(e, 1) }>
                                        <div>
                                            <i>{payStyle == 1 ? <img src={require('../images/icon_alipay_s.png')}/> :
                                                <img src={require('../images/icon_alipay_n.png')}/> }</i>
                                            <span>支付宝支付</span>
                                        </div>
                                    </li>
                                    <li className={payStyle == 2 ? 'active' : '' }
                                        onClick={(e) => this.changePay(e, 2) }>
                                        <div>
                                            <i>{payStyle == 2 ? <img src={require('../images/icon_wechat_s.png')}/> :
                                                <img src={require('../images/icon_wechat_n.png')}/> }</i>
                                            <span>微信支付</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            : null
                    }

                    {/*立即支付*/}
                    {
                        !wechat ?
                            <div className="pay-go">
                                <a href="javascript: void (0)" onClick={(e) => this.paySubmit(e) }>立即支付</a>
                            </div>
                            : null
                    }

                    {/*微信支付支付之后弹出*/}
                    {
                        wechat ?
                            <div className="pay-wechat">
                                <h3 className="item-title">支付方式</h3>
                                <div className="pay-msg-wechat">
                                    <div className="wechat-msg">
                                        <p>微信支付</p>
                                        {
                                            cancelqd ?
                                                <div className="wechat-msg">二维码已过期，<em onClick={(e) => this.refreshOrder(e)}>点击刷新</em>重新获取二维码</div>
                                                :
                                                <div className="wechat-msg">二维码30分钟后过期，过期后请重新刷新页面重新获取二维码</div>
                                        }
                                        <div className="qb">
                                            {
                                                erweima ?
                                                    <img src={'data:image/png;base64,' + erweima}/>
                                                    : null
                                            }
                                        </div>
                                        <span>请使用微信扫一扫<br/>扫描二维码支付</span>
                                    </div>
                                    <div className="wechat-tip">
                                        <img src={require('../images/pic_wechat.png')}/>
                                    </div>
                                </div>
                            </div>
                            : null
                    }

                </div>

                {/*阴影层*/}
                {
                    warningShow ?
                        <div className="cover-body"></div>
                        : null
                }

                {/*错误信息提示*/}
                {
                    warningShow ?
                        <PopWinodw popup={popupTip} cancel={(e) => this.cancel(e)} custom={(e) => this.goOrder(e)} />
                        : null
                }

                {/*引入底部导航组件*/}
                <FooterNav/>
                <CopyRight/>

            </div>
        )
    }
}

export {Pay}