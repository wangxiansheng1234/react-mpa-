/*
* 订单详情
* */

import React, {Component} from 'react';

import '../styles/common.css';
import '../styles/orderDetails.css';

import {HeaderTop} from '../commonviews/header-top';
import {FooterNav} from '../commonviews/footer';
import {CopyRight} from '../commonviews/copyRight';
import {ToolBar} from '../commonviews/tool-bar';
import {Nav} from '../commonviews/nav';
import {Loading} from '../commonviews/loading';
import {Mask} from '../commonviews/mask';
import {PopWinodw} from '../commonviews/popup-window';

import {ApiPost, ApiGet, getTimeStamp} from '../config/api';
import {encription} from "../util/query";
import {parseQueryString} from "../util/query";
import {getUser} from '../util/store';

class OrderDetails extends Component{
    static defaultProps = {
        pageType: {
            pageStatus: 1,//0/账户中心 ,1/订单管理
        }
    };

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            showLoading: false,
            showConfirm: false,
            confirmDialog:false,
            popup:{
                close: true,
                success: false,
                btnShow: true,
                leftBtn:'',
                rightBtn:'',
                knowTitle:'确认',
                title:''
            }
        }

        this.timeStamp = Date.parse(new Date());

        this.orderCode = -1;

        this.user = getUser();

        this.cancel = this.cancel.bind(this);

        this.URL = '';
    }

    componentWillMount(){

    }

    componentDidMount() {
        let that = this;
        let url = window.location.href;
        let params = parseQueryString(url);
        that.orderCode = params.code;
        that.requestOrderDetails();

        this.URL = window.location.protocol + '//'+ window.location.host;
    }

    requestOrderDetails(){
        let that = this;
        that.setState({
            isLoading:true
        });
        let data = {
            orderCode: that.orderCode,
            timeStamp: that.timeStamp,
            strToken: that.user.token,
            strUserId: that.user.userId
        };

        let param = {
            url: "/mobile-web-trade/ws/mobile/v1/order/order?sign=" + encription(data),
            params: data
        };
        ApiPost(param)
            .then((res) => {
                if(res.code == 1){
                    let orders = res.response.order;
                    that.setState({
                        orders: orders,
                        orderCode: orders.orderCode,
                        createTime: orders.createTime,
                        status: orders.status,
                        address: orders.address,
                        invoiceTitle: orders.invoiceTitle,
                        storeName: orders.storeName,
                        promotionAmount: orders.promotionAmount,
                        orderDetails: orders.orderDetails,
                        isLoading:false
                    })
                }else{
                    that.setState({
                        isLoading:false
                    })
                }
            })
            .catch((error) => {
                that.setState({
                    isLoading: false
                })
            })
    }

    //1未付款 2订单待审核 3 待发货 4 待收货 5待评价 6交易完成 7已取消 11退货处理中 12退货完成 40 退款处理中
    getOrderStatus(status){
        let statusStr = [];
        switch (status){
            case 1 :
                statusStr[0] = '未付款';
                statusStr[1] = '去支付';
                break;
            case 2 :
                statusStr[0] = '订单待审核';
                statusStr[1] = '';
                break;
            case 3 :
                statusStr[0] = '待发货';
                statusStr[1] = '';
                break;
            case 4 :
                statusStr[0] = '待收货';
                statusStr[1] = '确认收货';
                break;
            case 5 :
                statusStr[0] = '待评价';
                statusStr[1] = '申请退货';
                break;
            case 6 :
                statusStr[0] = '交易完成';
                statusStr[1] = '申请退货';
                break;
            case 7 :
                statusStr[0] = '已取消';
                statusStr[1] = '再次购买';
                break;
            case 11 :
                statusStr[0] = '退货处理中';
                statusStr[1] = '再次购买';
                break;
            case 12 :
                statusStr[0] = '退货完成';
                statusStr[1] = '再次购买';
                break;
            case 20:
                statusStr[0] = '线下支付待审核';
                statusStr[1] = '再次购买';
                break;
            case 40 :
                statusStr[0] = '退款处理中';
                statusStr[1] = '再次购买';
                break;
            case 41 :
                statusStr[0] = '已退款';
                statusStr[1] = '再次购买';
                break;
            case 51 :
                statusStr[0] = '已完成';
                statusStr[1] = '再次购买';
                break;
            default:
                statusStr[0] = '状态码：' + status;
                statusStr[1] = '再次购买';
                break;
        }

        return statusStr;
    }

    parseTime(timeStamp){
        let date = new Date(timeStamp);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        let second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
    }

    cancel(){
        this.setState({
            confirmDialog: false,
            showConfirm:false
        })
    }

    statusChangeDialog(orderCode, status, price){
        let that = this;
        if(status === 4){
            that.setState({
                showConfirm: true,
                confirmDialog: true,
                popup:{
                    close: true,
                    success: false,
                    btnShow: true,
                    leftBtn:'确认',
                    rightBtn:'关闭',
                    title:'是否确认已收到货品？',
                }
            })
        }else if(status === 5 || status === 6){
            that.setState({
                showConfirm: true,
                confirmDialog: true,
                popup:{
                    close: true,
                    success: false,
                    btnShow: true,
                    leftBtn:'确认',
                    rightBtn:'关闭',
                    title:'是否确认需要退货？'
                }
            })
        }else{
            that.buyBtn(orderCode, status, price);
        }
    }

    changeOrderStatus(status, orderCode){
        let that = this;
        that.setState({
            showConfirm: false,
            confirmDialog: false,
            isLoading: true
        })
        let data = {};
        if(status === 1){
            data = {
                orderCode: orderCode,
                orderStatus: 7,
                strToken: that.user.token,
                strUserId: that.user.userId,
                userId: that.user.userId,
                timeStamp: that.timeStamp,
            };
        }else if(status === 4){
            data = {
                orderCode: orderCode,
                orderStatus: 5,
                strToken: that.user.token,
                strUserId: that.user.userId,
                userId: that.user.userId,
                timeStamp: that.timeStamp,
            };
        }else if(status === 5 || status === 6){
            data = {
                orderCode: orderCode,
                orderStatus: 11,
                strToken: that.user.token,
                strUserId: that.user.userId,
                userId: that.user.userId,
                timeStamp: that.timeStamp,
            };
        }

        let param = {
            url: "/mobile-web-trade/ws/mobile/v1/order/changeStatus?sign=" + encription(data),
            params: data
        };
        ApiPost(param)
            .then((res) => {
                that.setState({
                    isLoading: false
                })
                if(res.code == 1){
                    that.requestOrderDetails();
                }else{

                }
            })
            .catch((error) => {
                that.setState({
                    isLoading: false
                })
            })
    }

    //综合顶部按钮，购买/状态修改。
    buyBtn(orderCode, status, price){
        let that = this;
        if(status === 1){
            window.location.href = that.URL + '/cashier/index.action' + '?totalPrice=' + price + '&orderType=' + orderCode;;
        }else if(status <= 6){
            that.changeOrderStatus(status, orderCode);
        }else{
            that.setState({showLoading: true});
            let data = {
                strUserId: that.user.userId,
                strToken: that.user.token,
                orderCode: orderCode,
                timeStamp: that.timeStamp,
            };

            let params = {
                url: '/mobile-web-trade/ws/mobile/v1/order/buyAgain?sign=' + encription(data),
                method: 'post',
                params: data,
            };

            ApiPost(params)
                .then((data) => {
                    that.setState({
                        showLoading: false
                    })
                    if(data.code == 1){
                        window.location.href = 'cart.action';
                    }
                })
                .catch((error) => {
                })
        }
    }

    changeImg(e){
        let element = e.currentTarget;
        element.src = require('../images/def-goods.jpg');
    }

    render(){
        let that = this;
        const {pageType} = this.props;
        let statusStr = that.getOrderStatus(that.state.status);
        let orders = that.state.orders;
        return(
            <div className="container">

                {/*顶部*/}
                <HeaderTop/>

                {/*导航栏*/}
                <Nav pageType={pageType}/>

                {
                    that.state.showLoading ? <Loading/> : null
                }

                {
                    that.state.showConfirm ? <Mask/> : null
                }

                {
                    that.state.confirmDialog ? <PopWinodw cancel={that.cancel} confirm={that.changeOrderStatus.bind(that, that.state.status, that.state.orderCode)} custom={that.cancel} popup={that.state.popup}/> : null
                }

                {
                    that.state.orders ? (
                        <div className="main-container-od">
                            <div className="navigator">
                                <span><a href="orderManage.html">我的订单</a><i>&gt;</i>订单号:{that.state.orderCode}</span>
                            </div>

                            <div className="order-status-container">
                                <span className="status">{statusStr[0]}</span>
                                <a className="btn" onClick={that.statusChangeDialog.bind(that, that.state.orderCode, that.state.status, orders.totalPrice)} style={statusStr[1] ? {} : {display:'none'}}>{statusStr[1]}</a>
                                <div className="progress-wrap" style={that.state.status > 6 ? {display: 'none'} : {}}>
                                        <ul className="pay-status fixed">
                                            <li className="done">
                                                <div>
                                                    <em>1</em>
                                                    <span>提交订单</span>
                                                </div>
                                            </li>
                                            <li className={`proce${that.state.status > 1 ? ' done' : ' ready'}`}></li>
                                            <li className={that.state.status > 1 ? 'done' : 'wait'}>
                                                <div>
                                                    <em>2</em>
                                                    <span>订单支付</span>
                                                </div>
                                            </li>
                                            <li className={`proce${that.state.status >= 4 ? ' done' : that.state.status >= 2 || that.state.status >= 3 ? ' ready' : ' wait' }`}></li>
                                            <li className={that.state.status >= 4 ? 'done' : 'wait'}>
                                                <div>
                                                    <em>3</em>
                                                    <span>发货</span>
                                                </div>
                                            </li>
                                            <li className={`proce${that.state.status >= 5 ? ' done' : that.state.status == 4 ? ' ready' : ' wait' }`}></li>
                                            <li className={that.state.status >= 5 ? 'done' : 'wait'}>
                                                <div>
                                                    <em>4</em>
                                                    <span>完成</span>
                                                </div>
                                            </li>
                                        </ul>
                                </div>
                            </div>

                            <p className="order-middle-title">订单信息</p>

                            <div className="order-info-container">
                                <span>订单编号：<em>{that.state.orderCode}</em></span>
                                <span>发票抬头：<em>{that.state.invoiceTitle}</em></span>
                                <span>下单时间：<em>{that.parseTime(that.state.createTime)}</em></span>
                                <span>卖家：<em>{that.state.storeName}</em></span>
                                <span className="b">收货人：<em>{that.state.address.name}</em></span>
                                <span className="b">收货人地址：<em>{that.state.address.province + that.state.address.city + that.state.address.area + that.state.address.address + '(' + that.state.address.phone + ')'}</em></span>
                            </div>

                            <p className="order-middle-title">商品及服务信息</p>

                            <div className="goods-and-service-container">

                                <div className="table-header">
                                    <span className="store-name"><em>{that.state.storeName}</em></span>
                                    <span className="title-service">服务信息</span>
                                    <span className="title-unit-price">单价（元）</span>
                                    <span className="title-num">数量</span>
                                    <span className="title-sum-price">小计（元）</span>
                                </div>
                                <div className="order-details-wrap">
                                    {
                                        that.state.orderDetails.length > 0 ? that.state.orderDetails.map((goodsInfo)=>{
                                            return (
                                                <div className="goods-details-box" key={goodsInfo.goodsItemId}>
                                                    <a className="goods-box"  href={`00000000/${goodsInfo.goodsItemId}.html`}>
                                                        <img src={goodsInfo.img} onError={ that.changeImg.bind(that) }/>
                                                        <div className="text-info">
                                                            <p>{goodsInfo.goodsName}</p>
                                                            <div className="size-info">规格:{goodsInfo.normsValue}</div>
                                                        </div>
                                                    </a>
                                                    <div className="service-info">{goodsInfo.taxPrice != 0 ? '税费：￥' + goodsInfo.taxPrice : '商家包税'}</div>
                                                    <div className="unit-price">￥{goodsInfo.price}</div>
                                                    <div className="num">{goodsInfo.quantity}</div>
                                                    <div className="sum-price">￥{goodsInfo.price}</div>
                                                </div>
                                            )
                                        }):null
                                    }

                                    <div className="message-and-total">
                                        <div className="leave-message">
                                            <span className="message-title">给卖家留言：</span>
                                            <span className="message-content">{orders.buyMessage}</span>
                                        </div>
                                        <div className="total-price">
                                            <span className="b10"><i>商品金额：</i><em>{orders.totalGoodsPrice}</em></span>
                                            <span className="b10"><i>运费：</i><em>{orders.logisticsFare == 0 ? '免运费' : orders.logisticsFare}</em></span>
                                            <span className="b10" style={orders.totalTaxPrice == 0 ? {display:'none'}:{}}><i>税费：</i><em>{orders.totalTaxPrice}</em></span>
                                            <span className="b10" style={orders.storeTicketAmount == 0 ? {display:'none'}:{}}><i>店铺折扣：</i><em className="red">-{orders.storeTicketAmount}</em></span>
                                            <span className="b10" style={orders.discountAmount == 0 ? {display:'none'}:{}}><i>会员折扣：</i><em className="red">-{orders.discountAmount}</em></span>
                                            <span className="b10" style={orders.deductionAmount == 0 ? {display:'none'}:{}}><i>积分折扣：</i><em className="red">-{orders.deductionAmount}</em></span>
                                            <span className="b10" style={orders.promotionAmount == 0 ? {display:'none'}:{}}><i>活动折扣：</i><em className="red">-{orders.promotionAmount}</em></span>
                                            <span className="b10" style={orders.lhAmount == 0 ? {display:'none'}:{}}><i>优惠券/卡：</i><em className="red">-{orders.lhAmount}</em></span>
                                            <span><i>合计：</i><em>￥{orders.totalPrice}</em></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null
                }

                {/*工具栏浮标*/}
                <ToolBar/>

                {/*footer*/}
                <FooterNav/>

                {/*copyRight*/}
                <CopyRight/>

            </div>
        )
    }
}

export { OrderDetails }
