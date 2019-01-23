/*
* 订单管理
* */

import React, {Component} from 'react';

import '../styles/common.css';
import '../styles/orderManage.css';

import {Pagination} from './pagination';
import {HeaderTop} from '../commonviews/header-top';
import {Nav} from '../commonviews/nav';
import {FooterNav} from '../commonviews/footer';
import {CopyRight} from '../commonviews/copyRight';
import {ToolBar} from '../commonviews/tool-bar';
import {Loading} from '../commonviews/loading';
import {Mask} from '../commonviews/mask';
import {PopWinodw} from '../commonviews/popup-window';

import {ApiPost, ApiGet, getTimeStamp} from '../config/api';
import {encription} from "../util/query";
import {getUser} from '../util/store';
import {parseQueryString} from "../util/query";

class OrderManager extends Component{
    static defaultProps = {
        pageType: {
            pageStatus: 1,//0/账户中心 ,1/订单管理
        }
    };

    constructor(props){
        super(props);

        this.state = {
            currentTab:0,
            orderStatus:[100,101,102,103,104],
            orderNum:[0,0,0,0,0],
            pageRows: 10,
            toPage:[1,1,1,1,1],
            totalPage:[1,1,1,1,1],
            ordersList:[[],[],[],[],[]],
            isLoading: false,
            returnsCount:0,
            waitingEvaluateCount:0,
            waitingPayCount:0,
            waitingPostCount:0,
            waitingReceivingCount:0,
            showLoading:false,
            showConfirm: false,
            confirmDialog:false,
            pendingCode:0,
            pendingStatus:0,
            popup:{
                close: true,
                success: false,
                btnShow: true,
                leftBtn:'',
                rightBtn:'',
                knowTitle:'确认',
                title:''
            }
        };

        this.timeStamp = Date.parse(new Date());

        this.user = getUser();
        this.URL = '';

        this.cancel = this.cancel.bind(this);

        this.sh = 0;

        this.startTimer = this.startTimer.bind(this);

        this.cancelTime = 0;
    }

    componentWillMount(){
        
    }

    componentDidMount() {
        this.requestOrderList();
        this.requestUserInfo();

        this.URL = window.location.protocol + '//'+ window.location.host;
    }

    redToPage(page){
        let that = this;
        page = Number(page);
        if(page > that.state.totalPage[that.state.currentTab] || page < 1){
            return;
        }
        let toPage = that.state.toPage;
        toPage[that.state.currentTab] = page;
        if (!!(window.history && history.pushState)){
            // history.pushState(null, null, window.location.href);
        }
        that.setState({
            toPage: toPage
        },function () {
            that.requestOrderList();
        });
        window.scroll(0, 0);
    }

    requestUserInfo(){
        let that = this;
        let data = {
            strToken: that.user.token,
            strUserId: that.user.userId,
            userId: that.user.userId,
            timeStamp: that.timeStamp,
        };

        let param = {
            url: "/mobile-web-user/ws/mobile/v1/user/getUserinfo?sign=" + encription(data),
            params: data
        };
        ApiPost(param)
            .then((res) => {
                if(res.code == 1){
                    that.setState({
                        waitingEvaluateCount:res.response.waitingEvaluateCount,
                        waitingPayCount:res.response.waitingPayCount,
                        waitingPostCount:res.response.waitingPostCount,
                        waitingReceivingCount:res.response.waitingReceivingCount,
                        returnsCount:res.response.returnsCount,
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

    requestOrderList(){
        let that = this;
        that.setState({
            isLoading:true
        });

        if(that.sh){
            window.clearInterval(that.sh);
        }
        let data = {
            orderStatus: that.state.orderStatus[that.state.currentTab],
            pageRows: that.state.pageRows,
            toPage: that.state.toPage[that.state.currentTab],
            strToken: that.user.token,
            strUserId: that.user.userId,
            userId: that.user.userId,
            timeStamp: that.timeStamp,
        };

        let param = {
            url: "/mobile-web-trade/ws/mobile/v1/order/list?sign=" + encription(data),
            params: data
        };
        ApiPost(param)
            .then((res) => {
                if(res.code == 1){
                    let ordersList = that.state.ordersList;
                    let toPage = that.state.toPage;
                    let orderNum = that.state.orderNum;
                    let totalPage = that.state.totalPage;
                    ordersList[that.state.currentTab] = res.response.orders || [];
                    toPage[that.state.currentTab] = res.page.curPage || 1;
                    orderNum[that.state.currentTab] = res.page.totalRows || 0;
                    totalPage[that.state.currentTab] = res.page.pageAmount || 1;
                    that.currentTime = res.response.timeStamp;
                    that.cancelTime = res.response.cancelTime;
                    that.setState({
                        isLoading:false,
                        ordersList: ordersList,
                        toPage: toPage,
                        orderNum:orderNum,
                        totalPage: totalPage,
                        currentTime: res.response.orders.timeStamp,
                        showConfirm: false,
                        confirmDialog: false,
                    }, function () {
                        that.sh = window.setInterval(that.startTimer.bind(that), 1000);
                    });

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

    startTimer(){
        let that = this;
        let ordersList = that.state.ordersList;

        let cancelTime = that.cancelTime;

        if(!ordersList[that.state.currentTab]  || ordersList[that.state.currentTab].length === 0){
            return;
        }

        ordersList[that.state.currentTab].map(function (item, index) {
            if(item.status == 1){
                //开始倒计时。
                let createTime = item.createTime;
                let currentTime = that.currentTime;

                let tempCreate = new Date(createTime);
                tempCreate.setMinutes(tempCreate.getMinutes() + cancelTime);

                let deadLine = tempCreate;

                let leftTime = Date.parse(deadLine) - currentTime;

                let hours = that.checkTime(parseInt(leftTime / 1000 / 60 / 60 % 24 , 10)); //计算剩余的小时
                let minutes = that.checkTime(parseInt(leftTime / 1000 / 60 % 60, 10));//计算剩余的分钟
                let seconds = that.checkTime(parseInt(leftTime / 1000 % 60, 10));//计算剩余的秒数

                ordersList[that.state.currentTab][index].leftTime = hours + '小时 ' + minutes + '分 '+ seconds + '秒';
            }
        });

        that.setState({
            ordersList:ordersList
        });

        that.currentTime = Number(that.currentTime) + 1000;
    }

    checkTime(i){ //将0-9的数字前面加上0，例1变为01
        if(i<0){
            return '00';
        }
        if(i<10)
        {
            i = "0" + i;
        }
        return i;
    }

    changeOrderStatus(status, orderCode){
        let that = this;

        that.setState({
            showConfirm: false,
            confirmDialog: false,
            isLoading: true
        });

        that.requestOrderDetails(-1, orderCode, status)
        /*let data = {};
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
                console.log(res)
                if(res.code == 1){
                    that.requestOrderList();
                    that.requestUserInfo();
                }else{

                }
            })
            .catch((error) => {

            })*/
    }

    clickTab(tabIndex){
        let that = this;
        that.setState({
            currentTab: tabIndex
        },function () {
            that.requestOrderList();
        })
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

    //1未付款 2订单待审核 3 待发货 4 待收货 5待评价 6交易完成 7已取消 11退货处理中 12退货完成 40 退款处理中
    getOrderStatus(status){
        let statusStr = [];
        switch (status){
            case 1 :
                statusStr[0] = '未付款';
                statusStr[1] = '取消订单';
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
                statusStr[1] = '';
                break;
            case 11 :
                statusStr[0] = '退货处理中';
                statusStr[1] = '';
                break;
            case 12 :
                statusStr[0] = '退货完成';
                statusStr[1] = '';
                break;
            case 20:
                statusStr[0] = '线下支付待审核';
                statusStr[1] = '';
                break;
            case 40 :
                statusStr[0] = '退款处理中';
                statusStr[1] = '';
                break;
            case 41 :
                statusStr[0] = '已退款';
                statusStr[1] = '';
                break;
            case 51 :
                statusStr[0] = '已完成';
                statusStr[1] = '';
                break;
            default:
                statusStr[0] = '状态码：' + status;
                statusStr[1] = '';
                break;
        }

        return statusStr;
    }

    statusChangeDialog(orderCode, status){
        let that = this;
        if(status === 4){
            that.setState({
                showConfirm: true,
                confirmDialog: true,
                pendingCode:orderCode,
                pendingStatus:status,
                popup:{
                    close: true,
                    success: false,
                    btnShow: true,
                    leftBtn:'确认',
                    rightBtn:'关闭',
                    title:'是否确认已收到货品？'
                }
            })
        }else if(status === 5 || status === 6){
            that.setState({
                showConfirm: true,
                confirmDialog: true,
                pendingCode:orderCode,
                pendingStatus:status,
                popup:{
                    close: true,
                    success: false,
                    btnShow: true,
                    leftBtn:'确认',
                    rightBtn:'关闭',
                    title:'是否确认需要退货？'
                }
            })
        }else if(status === 1){
            that.setState({
                showConfirm: true,
                confirmDialog: true,
                pendingCode:orderCode,
                pendingStatus:status,
                popup:{
                    close: true,
                    success: false,
                    btnShow: true,
                    leftBtn:'确认',
                    rightBtn:'关闭',
                    title:'是否确认取消订单？'
                }
            })
        }else{
            that.changeOrderStatus(status, orderCode);
        }
    }

    chageStatusRequest(status, orderCode){
        let that = this;
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
                if(res.code == 1){
                    that.requestOrderList();
                    that.requestUserInfo();
                }else{

                }
            })
            .catch((error) => {

            })
    }

    requestOrderDetails(price, orderCode, status){
        let that = this;
        that.setState({
            isLoading:true
        });
        let data = {
            orderCode: orderCode,
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
                    if(orders.status == 1 && status == 1 && price > 0){
                        window.location.href = that.URL + '/cashier/index.action' + '?totalPrice=' + price + '&orderType=' + orderCode;
                    }else if(orders.status == status && price === -1){
                        that.chageStatusRequest(status, orderCode)
                    }else{
                        that.requestOrderList();
                        that.requestUserInfo();
                    }
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

    //综合购买入口。再次购买，去支付
    buyBtn(orderCode, status, price){
        let that = this;
        if(status === 1){
            that.requestOrderDetails(price, orderCode, status)
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

    cancel(){
        this.setState({
            confirmDialog: false,
            showConfirm:false
        })
    }

    changeImg(e){
        let element = e.currentTarget;
        element.src = require('../images/def-goods.jpg');
    }

    render(){
        let that = this;
        const {pageType} = this.props;
        let configs = {currentPage:that.state.toPage[that.state.currentTab], totalPage:that.state.totalPage[that.state.currentTab], totalNum:that.state.orderNum[that.state.currentTab]};
        return (
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
                    that.state.confirmDialog ? <PopWinodw cancel={that.cancel} confirm={that.changeOrderStatus.bind(that, that.state.pendingStatus, that.state.pendingCode)} custom={that.cancel} popup={that.state.popup}/> : null
                }

                <div className="main-container-om">
                    <p className="page-title">订单管理</p>
                    <div className="switch-tabs-container">
                        <a className={that.state.currentTab === 0 ? 'active' : ''} onClick={that.clickTab.bind(that, 0)}>全部订单<em>{that.state.orderNum[0]}</em></a>
                        <a className={that.state.currentTab === 1 ? 'active' : ''} onClick={that.clickTab.bind(that, 1)}>待支付订单<em>{that.state.waitingPayCount}</em></a>
                        <a className={that.state.currentTab === 2 ? 'active' : ''} onClick={that.clickTab.bind(that, 2)}>待发货订单<em>{that.state.waitingPostCount}</em></a>
                        <a className={that.state.currentTab === 3 ? 'active' : ''} onClick={that.clickTab.bind(that, 3)}>待收货订单<em>{that.state.waitingReceivingCount}</em></a>
                    </div>
                    <div className="table-title-container">
                        <a>下单时间</a>
                        <span className="unit-price">单价（元）</span>
                        <span className="num">数量</span>
                        <span className="total-price">支付总金额</span>
                        <span className="status">订单状态</span>
                        <span className="operation">操作</span>
                    </div>

                    {
                        !that.state.isLoading && that.state.ordersList[that.state.currentTab].length === 0 ?
                            <div className="empty-order-container">
                                <img src={require('../images/icon_order_dis.png')}/>
                                <span>您还没有任何订单哦，快去<a href="./">首页</a>逛逛吧~</span>
                            </div> : null
                    }


                    <div className="order-list-container">
                        {
                            !that.state.isLoading && that.state.ordersList[that.state.currentTab].length > 0 ? that.state.ordersList[that.state.currentTab].map((orderInfo,index)=>{
                                if(!orderInfo){
                                    return null;
                                }
                                let height = orderInfo.orderDetails.length * 113 - 1 ;
                                let style = {height: height + 'px'};
                                let styleLh = {height: height + 'px', lineHeight: height + 'px'};
                                let orderDate = that.parseTime(orderInfo.createTime);
                                let statusStr = that.getOrderStatus(orderInfo.status);
                                return (
                                    <div className="order-list-wrap" key={orderInfo.orderCode}>
                                        <div className="order-box">
                                            <div className="order-box-title">
                                                <span>下单时间：<em>{orderDate}</em></span>
                                                <span>订单编号：<em>{orderInfo.orderCode}</em></span>
                                                <span>卖家：<em>{orderInfo.storeName}</em></span>
                                                <i style={orderInfo.status == 1 ? {} : {display:'none'}} id={orderInfo.orderCode}>剩余支付时间: <em>{orderInfo.leftTime}</em></i>
                                            </div>
                                            <div className="order-goods-list">
                                                <div className="goods-info-wrap">
                                                    {
                                                        orderInfo.orderDetails.map((goodsInfo)=>{
                                                            return(
                                                                <a className="goods-box" href={`00000000/${goodsInfo.goodsItemId}.html`} key={goodsInfo.goodsItemId}>
                                                                    <img src={goodsInfo.img} onError={ that.changeImg.bind(that) }/>
                                                                    <div className="goods-text-info">
                                                                        <p>{goodsInfo.goodsName}</p>
                                                                        <div className="size-info">规格:{goodsInfo.normsValue}</div>
                                                                    </div>
                                                                    <div className="goods-price">￥{goodsInfo.price}</div>
                                                                    <div className="goods-num">{goodsInfo.quantity}</div>
                                                                </a>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className="order-total-price" style={styleLh}>￥{orderInfo.totalPrice}</div>
                                                <div className="order-status" style={style}>
                                                    <div className="status">
                                                        <span>{statusStr[0]}</span>
                                                        <a href={`orderDetails.html?code=${orderInfo.orderCode}`}>订单详情</a>
                                                    </div>
                                                </div>
                                                <div className="order-operation" style={style}>
                                                    <div className="operation">
                                                        <a className="buy-btn" onClick={that.buyBtn.bind(that, orderInfo.orderCode, orderInfo.status, orderInfo.totalPrice)}>{orderInfo.status === 1 ? '去付款' : '再次购买'}</a>
                                                        <a className="cancel-btn" onClick={that.statusChangeDialog.bind(that, orderInfo.orderCode, orderInfo.status)}>{statusStr[1]}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }): null
                        }
                    </div>
                    {
                        that.state.isLoading || that.state.ordersList[that.state.currentTab].length === 0 ? null : <Pagination configs={configs} toPage={that.redToPage.bind(that)}/>
                    }
                </div>

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

export {OrderManager}
