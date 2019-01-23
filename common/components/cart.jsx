/*
 * 购物车模块
 * */

import React, {Component} from 'react';


//引入公共组件
import {FcHeader} from '../commonviews/fc-header';
import {HeaderTop} from '../commonviews/header-top';
import {FooterNav} from '../commonviews/footer';
import {CopyRight} from '../commonviews/copyRight';
import {PopWinodw} from '../commonviews/popup-window';
import {Loading} from '../commonviews/loading';
import {NewAddress} from '../commonviews/newAddress';

//引入js
import {encription} from '../util/query';
import {ApiPost} from '../config/api';
import {getUser} from '../util/store';
import {NoRepeat, SplitArray, Tip} from '../util/util';

//引入样式
import '../styles/common.css';
import '../styles/cart.css';

class Cart extends Component {

    static defaultProps = {
        popup: {
            title: '确定要删除商品?',
            btnShow: true,
            leftBtn: '确认',
            rightBtn: '取消',
        }
    };

    constructor(props) {
        super(props);

        //初始化数据
        this.state = {
            loading: false, //正在加载中
            coverShow: false, //阴影层
            userStatus: false, //登录状态
            show: false, //购物车空状态
            reshow: false, //是否分开结算
            dataShow: false, //购物车不为空
            deleteShow: false, //删除弹出窗状态
            hasAddress: 0, //无地址
            totalGoodsAmount: 0, //商品总价
            totalTaxAmount: 0,  //税费
            carts: [], //购物车数据
            cartIds: [], //删除的店铺id
            cartItemIds: [], //删除的商品id
            historyList: [],  //历史浏览数据
            _position: 0, //历史记录滚动记录
            churchyard: 0, //境内件数
            overseas: 0,  //境外件数
            goodsSource: 2, //境内外支付方式
            warningShow: false, //警告提示窗
            popupTip: {
                title: '',
                leftBtn: '',
                rightBtn: '',
                btnShow: false,
            }, //警告提示窗
            addressShow: false, //新增地址弹窗状态
            modify: {             //地址修改之前参数
                m_addressId: '',
                m_name: '',
                m_province: '',
                m_city: '',
                m_area: '',
                m_address: '',
                m_phone: '',
            },
            kucunShow: false, //库存发生变动
            kucunTip: {
                title: '',
                leftBtn: '',
                rightBtn: '',
                btnShow: false,
            }, //库存弹窗
            saleShow: false,
            saleTip: {
                title: '',
                leftBtn: '',
                rightBtn: '',
                btnShow: false,
            },
            loginShow: false,
            loginTip: {
                title: '登录状态已失效，请重新登录',
                leftBtn: '',
                rightBtn: '',
                btnShow: false,
                close: true,
                knowTitle: '去登录',
            },
        };

        //事件绑定
        this.goLogin = this.goLogin.bind(this);
        this.goHome = this.goHome.bind(this);
        this.deleteGood = this.deleteGood.bind(this);
        this.deleteGoods = this.deleteGoods.bind(this);
        this.cancel = this.cancel.bind(this);
        this.confirm = this.confirm.bind(this);
        this.changTotalStatus = this.changTotalStatus.bind(this);
        this.reduceQt = this.reduceQt.bind(this);
        this.addQt = this.addQt.bind(this);
        this.changQt = this.changQt.bind(this);
        this.changQts = this.changQts.bind(this);
        this.goProduct = this.goProduct.bind(this);
        this.goPay = this.goPay.bind(this);
        this.goBackCart = this.goBackCart.bind(this);
        this.choosePay = this.choosePay.bind(this);
        this.goAccount = this.goAccount.bind(this);
        this.addCart = this.addCart.bind(this);
        this.clickLeft = this.clickLeft.bind(this);
        this.clickRight = this.clickRight.bind(this);
        this.save = this.save.bind(this);
        this.goOrder = this.goOrder.bind(this);

    }

    componentDidMount() {
        //获取user
        this.user = getUser();
        //初始化购物车
        if (this.user) {
            this.apiRequest();
        }
        else {
            this.setState({userStatus: true});
        }
    }

    apiRequest() {
        let data = {
            userId: this.user.userId,
            strUserId: this.user.userId,
            strToken: this.user.token,
        };
        let params = {
            url: '/mobile-web-trade/ws/mobile/v1/cart/list?sign=' + encription(data),
            params: data
        };

        ApiPost(params)
            .then((data) => {
                if (data.code == -10) {
                    this.setState({userStatus: true});
                }
                else if (data.code == 1) {
                    this.setState({
                        userStatus: false,
                        dataShow: data.response.carts.length > 0 ? true : false,
                        totalGoodsAmount: data.response.totalGoodsAmount,  //总价
                        totalTaxAmount: data.response.totalTaxAmount,  //税费
                        carts: data.response.carts,
                    }, () => {
                        if (data.response.carts.length == 0) {
                            this.apiHistory();
                        }
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    //历史请求数据
    apiHistory() {
        let that = this;
        let data = {
            userId: that.user.userId,
            strUserId: that.user.userId,
            strToken: that.user.token,
            mark: 7,
            timeStamp: that.timeStamp,
        };

        for(let i = 0; i < 3; i++){
            console.log
        }

        let param = {
            url: '/mobile-web-search/ws/mobile/v1/search/list?sign=' + encription(data),
            params: data,
        };
        ApiPost(param)
            .then((data) => {
                if (data.code == 1) {
                    this.setState({
                        show: true,
                        historyList: SplitArray(4, data.response.goodsListVO.list),
                    })
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }

    //去登录
    goLogin(e) {
        e.stopPropagation();
        window.location.href = 'login.html?url=' + escape(window.location.href);
    }

    //去首页
    goHome(e) {
        e.stopPropagation();
        window.location.href = window.location.origin;
    }

    //去商品详情页
    goProduct(e, goodsItemId) {
        e.stopPropagation();
        window.open('/00000000/' + goodsItemId + '.html');
    }

    //加入购物车
    addCart(e, goods) {
        e.stopPropagation();
        let that = this;
        this.setState({
            loading: true,
        });
        let data = {
            userId: that.user.userId,
            strToken: that.user.token,
            strUserId: that.user.userId,
            goodsId: goods.goodsId,
            storeId: goods.storeId,
            goodsItemId: goods.id,
            quantity: 1,
        };
        let param = {
            url: '/mobile-web-trade/ws/mobile/v1/cart/add?sign=' + encription(data),
            params: data,
        };
        ApiPost(param)
            .then((data) => {
                if (data.code == 1) {
                    this.setState({
                        show: false,
                        loading: false,
                    }, () => {
                        that.apiRequest();
                    });
                }
                else if(data.code == -10){
                    this.setState({
                        loading: false,
                        loginShow: true,
                        loginTip: {
                            title: '登录状态已失效，请重新登录',
                            leftBtn: '',
                            rightBtn: '',
                            btnShow: false,
                            close: true,
                            knowTitle: '去登录',
                        },
                    })
                }
                else {
                    this.setState({
                        loading: false,
                        warningShow: true,
                        popupTip: {
                            title: data.msg,
                            leftBtn: '',
                            rightBtn: '',
                            btnShow: false,
                        }
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    warningShow: true,
                    popupTip: {
                        title: '服务器连接超时，请重新操作!',
                        leftBtn: '',
                        rightBtn: '',
                        btnShow: false,
                    }
                })
            })
    }

    //删除单个商品
    deleteGood(e, cartItemId) {
        //阻止事件冒泡
        e.stopPropagation();
        let cartItemIds = [];
        cartItemIds.push(cartItemId);
        this.setState({
            deleteShow: true,
            coverShow: true,
            cartIds: [],
            cartItemIds: cartItemIds,
        })
    }

    //删除选择的
    deleteGoods(e, carts) {
        //阻止事件冒泡
        e.stopPropagation();

        //将数据塞入数组中
        let cartIds = [];
        let isSelected = 1;
        let cartItemIds = [];
        for (let i = 0; i < carts.length; i++) {
            let goodsGroup = carts[i].goodsGroup;
            for (let j = 0; j < goodsGroup.length; j++) {
                let goodsItems = goodsGroup[j].goodsItems;
                for (let m = 0; m < goodsItems.length; m++) {
                    if (goodsItems[m].isSelected == 1) {
                        cartIds.push(carts[i].cartId);
                        cartItemIds.push(goodsItems[m].cartItemId);
                    }
                    if (goodsItems[m].isSelected == 0) {
                        isSelected = 0;
                    }
                }
            }
        }

        cartIds = isSelected == 1 ? cartIds : [];

        if (cartItemIds.length == 0) {
            this.setState({
                warningShow: true,
                popupTip: {
                    title: '您还没有选择删除的商品',
                    leftBtn: '',
                    rightBtn: '',
                    btnShow: false,
                }
            });
            return false;
        }
        this.setState({
            deleteShow: true,
            coverShow: true,
            cartIds: NoRepeat(cartIds),
            cartItemIds: cartItemIds,
        })
    }

    //取消删除
    cancel(e) {
        e.stopPropagation();
        this.setState({
            deleteShow: false,
            coverShow: false,
            warningShow: false,
            popupTip: {
                title: '',
                leftBtn: '',
                rightBtn: '',
                btnShow: false,
            }, //警告提示窗
            addressShow: false, //新增地址弹窗状态
            kucunShow: false,
            kucunTip: {
                title: '',
                leftBtn: '',
                rightBtn: '',
                btnShow: false,
            }
        })
    }

    save() {
        this.setState({
            addressShow: false,
        })
    }

    //确认删除
    confirm(e) {
        e.stopPropagation();
        let {cartIds, cartItemIds} = this.state;
        this.delete(cartIds, cartItemIds);
    }

    delete(cartIds, cartItemIds) {
        let that = this;
        this.setState({
            loading: true,
        });
        let data = {
            userId: that.user.userId,
            strUserId: that.user.userId,
            strToken: that.user.token,
            cartIds: cartIds,
            cartItemIds: cartItemIds,
            timeStamp: that.timeStamp,
        };

        let param = {
            url: '/mobile-web-trade/ws/mobile/v1/cart/delete?sign=' + encription(data),
            params: data,
        };

        ApiPost(param)
            .then((data) => {
                this.setState({loading: false});
                if (data.code == 1) {
                    that.setState({
                        coverShow: false,
                        deleteShow: false,
                        dataShow: data.response.carts.length > 0 ? true : false,
                        carts: data.response.carts,
                        hasAddress: data.response.hasAddress,
                        totalGoodsAmount: data.response.totalGoodsAmount,
                        totalTaxAmount: data.response.totalTaxAmount,
                    }, () => {
                        if (data.response.carts.length == 0) {
                            that.apiHistory();
                        }
                    });
                }
                else if(data.code == -10){
                    this.setState({
                        loginShow: true,
                        loginTip: {
                            title: '登录状态已失效，请重新登录',
                            leftBtn: '',
                            rightBtn: '',
                            btnShow: false,
                            close: true,
                            knowTitle: '去登录',
                        },
                    })
                }
                else {
                    this.setState({
                        warningShow: true,
                        popupTip: {
                            title: data.msg,
                            leftBtn: '',
                            rightBtn: '',
                            btnShow: false,
                        }
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    warningShow: true,
                    popupTip: {
                        title: '服务器连接超时，请重新操作!',
                        leftBtn: '',
                        rightBtn: '',
                        btnShow: false,
                    }
                })
            })

    }

    //判断子状态是否被选中
    judge(item) {
        let isSelected = 1;
        for (let i = 0; i < item.length; i++) {
            let goodsItems = item[i].goodsItems;
            for (let j = 0; j < goodsItems.length; j++) {
                // if (goodsItems[j].goodsStatus == 20 && goodsItems[j].delFlag == 0 && goodsItems[j].goodsQyt != 0) {
                    if (goodsItems[j].isSelected == 0) {
                        isSelected = 0
                    // }
                }
            }
        }
        return isSelected;
    }

    //判断是否全选状态
    judgeTotal(item) {
        let isSelected = 1;
        for (let i = 0; i < item.length; i++) {
            let goodsGroup = item[i].goodsGroup;
            for (let j = 0; j < goodsGroup.length; j++) {
                let goodsItems = goodsGroup[j].goodsItems;
                for (let m = 0; m < goodsItems.length; m++) {
                    // if (( goodsItems[m].goodsStatus == 20 && goodsItems[m].delFlag == 0 ) && goodsItems[m].goodsQyt != 0) {
                        if (goodsItems[m].isSelected == 0) {
                            isSelected = 0
                         }
                    // }
                }
            }
        }
        return isSelected;
    }

    //改变单个商品状态
    changGoodsStatus(e, cartId, cartItemId) {
        //阻止事件冒泡
        e.stopPropagation();

        //根据被点击元素中是否还有class 类为 active 来判断 点击是选中 或 非选中
        let isSelected = e.currentTarget.getAttribute('class').indexOf('active') > -1 ? 0 : 1;

        //将数据塞入数组中
        let cartIds = [];
        let cartItemIds = [];
        cartIds.push(cartId);
        cartItemIds.push(cartItemId);
        //改变状态
        this.apiChange(isSelected, cartIds, cartItemIds);
    }

    //改变整个店铺状态
    changStoreStatus(e, cartId, items) {
        //阻止事件冒泡
        e.stopPropagation();

        //根据被点击元素中是否还有class 类为 active 来判断 点击是选中 或 非选中
        let isSelected = e.currentTarget.getAttribute('class').indexOf('active') > -1 ? 0 : 1;

        //将数据塞入数组中
        let cartIds = [];
        let cartItemIds = [];
        cartIds.push(cartId);
        //遍历数组
        for (let i = 0; i < items.length; i++) {
            let goodsItems = items[i].goodsItems;
            for (let j = 0; j < goodsItems.length; j++) {
                // if (goodsItems[j].goodsStatus == 20 && goodsItems[j].delFlag == 0 && goodsItems[j].goodsQyt != 0) {
                    cartItemIds.push(goodsItems[j].cartItemId);
                // }
            }
        }
        //改变状态
        this.apiChange(isSelected, cartIds, cartItemIds);
    }

    //改变购物车所有商品状态
    changTotalStatus(e, carts) {
        //阻止事件冒泡
        e.stopPropagation();


        //根据被点击元素中是否还有class 类为 active 来判断 点击是选中 或 非选中
        let isSelected = e.currentTarget.getAttribute('class').indexOf('active') > -1 ? 0 : 1;

        //将数据塞入数组中
        let cartIds = [];
        let cartItemIds = [];
        for (let i = 0; i < carts.length; i++) {
            cartIds.push(carts[i].cartId);
            let goodsGroup = carts[i].goodsGroup;
            for (let j = 0; j < goodsGroup.length; j++) {
                let goodsItems = goodsGroup[j].goodsItems;
                for (let m = 0; m < goodsItems.length; m++) {
                    // if (goodsItems[m].goodsStatus == 20 && goodsItems[m].delFlag == 0 && goodsItems[m].goodsQyt != 0) {
                        cartItemIds.push(goodsItems[m].cartItemId);
                    // }
                }
            }
        }

        //改变状态
        this.apiChange(isSelected, cartIds, cartItemIds);
    }

    //改变购物车状态请求
    apiChange(isSelected, cartIds, cartItemIds) {

        let that = this;

        let data = {
            userId: that.user.userId,
            strUserId: that.user.userId,
            strToken: that.user.token,
            cartIds: cartIds,
            cartItemIds: cartItemIds,
            isSelected: isSelected,
            timeStamp: that.timeStamp,
        };

        let param = {
            url: '/mobile-web-trade/ws/mobile/v1/cart/selected?sign=' + encription(data),
            params: data,
        };

        ApiPost(param)
            .then((data) => {

                if (data.code == 1) {
                    this.setState({
                        carts: data.response.carts,
                        hasAddress: data.response.hasAddress,
                        totalGoodsAmount: data.response.totalGoodsAmount,
                        totalTaxAmount: data.response.totalTaxAmount,
                    });
                }
                else if(data.code == -10){
                    this.setState({
                        loginShow: true,
                        loginTip: {
                            title: '登录状态已失效，请重新登录',
                            leftBtn: '',
                            rightBtn: '',
                            btnShow: false,
                            close: true,
                            knowTitle: '去登录',
                        },
                    })
                }
                else {
                    this.setState({
                        reshow: false,
                        warningShow: true,
                        popupTip: {
                            title: data.msg,
                            leftBtn: '',
                            rightBtn: '',
                            btnShow: false,
                        }
                    })
                }

            })
            .catch((error) => {
                console.log('服务器错误');
            })

    }

    //购物车失去被选状态
    loseCart(item) {
        //false 不能被选  true 可选
        let loseCart = false;
        //如果只有一个商品
        for (let s = 0; s < item.length; s++) {
            let goodsGroup = item[s].goodsGroup;
            for (let i = 0; i < goodsGroup.length; i++) {
                let goodsItems = goodsGroup[i].goodsItems;
                for (let j = 0; j < goodsItems.length; j++) {
                    if (goodsItems.length == 1) {
                        if (goodsItems[j].goodsStatus == 20 && goodsItems[j].delFlag == 0 && goodsItems[j].goodsQyt != 0 && goodsItems[j].goodsQyt > goodsItems[j].goodsStartNum) {
                            loseCart = true;
                        }
                        else {
                            loseCart = false;
                        }
                    }
                    else {
                        if (goodsItems[j].goodsStatus == 20 && goodsItems[j].delFlag == 0 && goodsItems[j].goodsQyt != 0 && goodsItems[j].goodsQyt > goodsItems[j].goodsStartNum) {
                            loseCart = true;
                        }
                    }
                }
            }
        }
        return loseCart;
    }

    //店铺失去被选状态
    loseChoose(item) {

        //false 不能被选  true 可选
        let loseChoose = false;

        //如果只有一个商品
        for (let i = 0; i < item.length; i++) {
            let goodsItems = item[i].goodsItems;
            for (let j = 0; j < goodsItems.length; j++) {
                if (goodsItems.length == 1) {
                    if (goodsItems[j].goodsStatus == 20 && goodsItems[j].delFlag == 0 && goodsItems[j].goodsQyt != 0 && goodsItems[j].goodsQyt > goodsItems[j].goodsStartNum) {
                        loseChoose = true;
                    }
                    else {
                        loseChoose = false;
                    }
                }
                else {
                    if (goodsItems[j].goodsStatus == 20 && goodsItems[j].delFlag == 0 && goodsItems[j].goodsQyt != 0 && goodsItems[j].goodsQyt > goodsItems[j].goodsStartNum) {
                        loseChoose = true;
                    }
                }
            }
        }
        return loseChoose;
    }

    //更新购物车商品数量
    //减少
    reduceQt(e, index, indexs, indext, cartItemId) {
        //阻止事件冒泡
        e.stopPropagation();

        if (e.currentTarget.getAttribute('class').indexOf('disabled') > -1) {
            return false;
        }

        const {carts} = this.state;
        //当前数量
        let number = carts[index].goodsGroup[indexs].goodsItems[indext].quantity;

        //改商品的当前最小起倍量
        let goodsMultipleNum = carts[index].goodsGroup[indexs].goodsItems[indext].goodsMultipleNum;

        let Number = number - goodsMultipleNum;

        //变更数量
        this.updateNumber(Number, cartItemId);
    }

    //增加
    addQt(e, index, indexs, indext, cartItemId) {
        //阻止事件冒泡
        e.stopPropagation();

        if (e.currentTarget.getAttribute('class').indexOf('disabled') > -1) {
            return false;
        }

        const {carts} = this.state;
        let number = carts[index].goodsGroup[indexs].goodsItems[indext].quantity;
        //该商品的当前最小起倍量
        let goodsMultipleNum = carts[index].goodsGroup[indexs].goodsItems[indext].goodsMultipleNum;

        let Number = number + goodsMultipleNum;

        //变更数量
        this.updateNumber(Number, cartItemId);
    }

    //改变商品数量
    changQts(e, index, indexs, indext) {
        //阻止事件冒泡
        e.stopPropagation();
        let Value = e.currentTarget.value;
        const {carts} = this.state;
        let kucun = carts[index].goodsGroup[indexs].goodsItems[indext].goodsQyt;
        let xiangou = carts[index].goodsGroup[indexs].goodsItems[indext].quotaQty;

        //最小起购量
        let goodsStartNum = carts[index].goodsGroup[indexs].goodsItems[indext].goodsStartNum;

        //最小购成倍量
        let goodsMultipleNum = carts[index].goodsGroup[indexs].goodsItems[indext].goodsMultipleNum;

        //如果不为数字，都为最小起购量
        if (Value == '') {
            carts[index].goodsGroup[indexs].goodsItems[indext].quantity = Value;
        }
        else if (isNaN(Value) || Value == ' ' || Value <= goodsStartNum) {
            carts[index].goodsGroup[indexs].goodsItems[indext].quantity = goodsStartNum;
        }
        else if (parseFloat(Value) > parseFloat(xiangou) && xiangou != 0) {
            carts[index].goodsGroup[indexs].goodsItems[indext].quantity = xiangou;
        }
        else if (parseFloat(Value) >= parseFloat(kucun) - parseFloat((kucun - goodsStartNum)% goodsMultipleNum) && xiangou == 0) {
            carts[index].goodsGroup[indexs].goodsItems[indext].quantity = (kucun - goodsStartNum) % goodsMultipleNum > 0 ? kucun - ((kucun - goodsStartNum) % goodsMultipleNum) : kucun;
        }
        else {
            carts[index].goodsGroup[indexs].goodsItems[indext].quantity = parseInt(Value) % goodsMultipleNum > 0 ? parseInt(Value) - parseInt(Value) % goodsMultipleNum : parseInt(Value);
        }
        this.setState({carts});
    }

    //失去焦点发送请求
    changQt(e, index, indexs, indext, cartItemId) {
        e.stopPropagation();
        const {carts} = this.state;
        let Number = carts[index].goodsGroup[indexs].goodsItems[indext].quantity;
        //最小起购量
        let goodsStartNum = carts[index].goodsGroup[indexs].goodsItems[indext].goodsStartNum;
        //手动不输入数量,判断数量给1 或者0
        if (Number == '' || Number == 0 || Number == ' ') {
            Number = goodsStartNum;
        }

        //变更数量
        this.updateNumber(Number, cartItemId);
    }

    //跟新数量
    updateNumber(quantity, cartItemId) {

        let that = this;

        let data = {
            userId: that.user.userId,
            strUserId: that.user.userId,
            strToken: that.user.token,
            quantity: quantity,
            cartItemId: cartItemId
        };

        let param = {
            url: '/mobile-web-trade/ws/mobile/v1/cart/updateQty?sign=' + encription(data),
            params: data,
        };
        ApiPost(param)
            .then((data) => {
                if (data.code == 1) {
                    that.setState({
                        carts: data.response.carts,
                        hasAddress: data.response.hasAddress,
                        totalGoodsAmount: data.response.totalGoodsAmount,
                        totalTaxAmount: data.response.totalTaxAmount,
                    });
                }
                else if(data.code == -10){
                    this.setState({
                        loginShow: true,
                        loginTip: {
                            title: '登录状态已失效，请重新登录',
                            leftBtn: '',
                            rightBtn: '',
                            btnShow: false,
                            close: true,
                            knowTitle: '去登录',
                        },
                    })
                }
                else if(data.code == 200005){
                    this.setState({
                        reshow: false,
                        saleShow: true,
                        saleTip: {
                            title: data.msg,
                            leftBtn: '',
                            rightBtn: '',
                            btnShow: false,
                        }
                    })
                }
                else {
                    this.setState({
                        warningShow: true,
                        popupTip: {
                            title: data.msg,
                            leftBtn: '',
                            rightBtn: '',
                            btnShow: false,
                        }
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    warningShow: true,
                    popupTip: {
                        title: '服务器连接超时，请重新操作!',
                        leftBtn: '',
                        rightBtn: '',
                        btnShow: false,
                    }
                })
            })

    }

    //提交订单
    goPay(e) {
        e.stopPropagation();

        const {carts} = this.state;

        let churchyard = 0; //境内数量
        let overseas = 0;  //境外数量

        //循环遍历得到境内境外的件数
        for (let i = 0; i < carts.length; i++) {
            let goodsGroup = carts[i].goodsGroup;
            for (let j = 0; j < goodsGroup.length; j++) {
                let goodsItems = goodsGroup[j].goodsItems;
                for (let m = 0; m < goodsItems.length; m++) {
                    if (goodsItems[m].goodsStatus == 20 && goodsItems[m].delFlag == 0 && goodsItems[m].goodsQyt != 0) {
                        if (goodsItems[m].isSelected == 1) {
                            if (goodsItems[m].goodsSource == 1) {
                                churchyard += goodsItems[m].quantity;
                            }
                            else if (goodsItems[m].goodsSource == 2 || goodsItems[m].goodsSource == 3) {
                                overseas += goodsItems[m].quantity;
                            }
                        }
                    }
                }
            }
        }

        if (churchyard == 0 && overseas == 0) {
            this.setState({
                warningShow: true,
                popupTip: {
                    title: '请选择有效商品！',
                    leftBtn: '',
                    rightBtn: '',
                    btnShow: false,
                }
            });
            return false;
        }

        //点击结算 goodsSource: 1, 境内 / 2, 境外
        if (churchyard > 0 && overseas > 0) {
            this.setState({
                reshow: true,
                churchyard: churchyard,
                overseas: overseas,
            });
        }
        else if (churchyard == 0 && overseas > 0) {
            this.goPaySubmit(2);
            return false;
        }
        else if (churchyard > 0 && overseas == 0) {
            this.goPaySubmit(1);
            return false;
        }

    }

    //取消支付
    goBackCart(e) {
        e.stopPropagation();
        this.setState({reshow: false});
    }

    //选择境内还是境外支付
    choosePay(e, index) {
        e.stopPropagation();
        this.setState({goodsSource: index})
    }

    //去支付
    goPaySubmit(goodsSource) {
        let that = this;

        this.setState({
            loading: true,
        });

        let data = {
            userId: that.user.userId,
            strUserId: that.user.userId,
            strToken: that.user.token,
            goodsSource: goodsSource,
        };

        let param = {
            url: '/mobile-web-trade/ws/mobile/v1/cal/doCal?sign=' + encription(data),
            method: 'post',
            params: data,
        };
        ApiPost(param)
            .then((data) => {
                this.setState({
                    loading: false,
                });
                if (data.code == 1) {
                    window.location.href = '/shopping/order.html?from=1&goodsSource=' + goodsSource;
                }
                else if(data.code == -10){
                    this.setState({
                        loginShow: true,
                        loginTip: {
                            title: '登录状态已失效，请重新登录',
                            leftBtn: '',
                            rightBtn: '',
                            btnShow: false,
                            close: true,
                            knowTitle: '去登录',
                        },
                    })
                }
                else if (data.code == 1700001) {
                    this.setState({
                        kucunShow: true,
                        kucunTip: {
                            title: '库存发生变动',
                            leftBtn: '',
                            rightBtn: '',
                            btnShow: false,
                            knowTitle: '提交订单',
                        }
                    })
                }
                //增加地址
                else if (data.code == 300014) {
                    this.setState({
                        addressShow: true,
                    })
                }
                else if( data.code == 200007 || data.code == 200004){
                    this.setState({
                        reshow: false,
                        saleShow: true,
                        saleTip: {
                            title: data.msg,
                            leftBtn: '',
                            rightBtn: '',
                            btnShow: false,
                        }
                    })
                }
                else {
                    this.setState({
                        reshow: false,
                        warningShow: true,
                        popupTip: {
                            title: data.msg,
                            leftBtn: '',
                            rightBtn: '',
                            btnShow: false,
                        }
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    warningShow: true,
                    popupTip: {
                        title: '服务器连接超时，请重新操作!',
                        leftBtn: '',
                        rightBtn: '',
                        btnShow: false,
                    }
                });
            })
    }

    //去提交订单页面
    goOrder() {
        const {goodsSource} = this.state;
        window.location.href = '/shopping/order.html?from=1&goodsSource=' + goodsSource;
    }

    //弹窗去结算
    goAccount() {
        const {goodsSource} = this.state;

        //结算
        this.goPaySubmit(goodsSource);
    }

    //左移右移
    clickLeft(e) {
        let {_position} = this.state;
        e.stopPropagation();
        if (_position == 0) {
            return false;
        }
        else {
            this.setState({_position: _position - 1})
        }
    }

    clickRight(e) {
        let {_position, historyList} = this.state;
        e.stopPropagation();
        if (_position == historyList.length - 1) {
            return false;
        }
        else {
            this.setState({_position: _position + 1})
        }
    }

    componentWillUnmount() {

    }

    render() {
        const {popup} = this.props;
        const {coverShow, show, reshow, dataShow, deleteShow, userStatus, totalGoodsAmount, totalTaxAmount, carts, goodsSource, overseas, churchyard, historyList, _position, warningShow, popupTip, loading, addressShow, modify, kucunShow, kucunTip,saleShow ,saleTip, loginShow, loginTip} = this.state;

        return (
            <div className="page">

                {/*顶部导航*/}
                <HeaderTop/>

                {/*搜索*/}
                <FcHeader/>

                {/*购物车不为空*/}
                {
                    dataShow ?
                        <div className="hy-cart-wrap">

                            <div className="hy-cart-thead fixed">
                                {/*{*/}
                                {/*this.loseCart(carts) ?*/}
                                    <div className="column t-checkbox">
                                    <i className={`hy-checkbox glob-checkbox${this.judgeTotal(carts) == 1 ? ' active' : ''}`}
                                    onClick={(e) => {
                                    this.changTotalStatus(e, carts)
                                }}></i>
                                    <label className="checked" htmlFor="toggle-checkbox-glob">全选</label>
                                    </div>
                                {/*: null*/}
                                {/*}*/}
                                <div className="column t-goods">商品信息</div>
                                <div className="column t-price">单价(元)</div>
                                <div className="column t-num">数量</div>
                                <div className="column t-sum">小计(元)</div>
                                <div className="column t-action">操作</div>
                            </div>

                            <div className="hy-cart-list">

                                {
                                    carts.map((item, index) => {
                                        return (
                                            <div className="cart-list-item" key={index}>

                                                <div className="cart-item-thead fixed">
                                                    <div className="cart-shop-checkbox">
                                                        {/*{*/}
                                                        {/*!this.loseChoose(item.goodsGroup) ?*/}
                                                        {/*null :*/}
                                                            <i className={`hy-checkbox store-checkbox${ this.judge(item.goodsGroup) == 1 ? ' active' : ''}`}
                                                            onClick={(e) => {
                                                            this.changStoreStatus(e, item.cartId, item.goodsGroup)
                                                        }}></i>
                                                        {/*}*/}
                                                        <label>{item.storeName}</label>
                                                    </div>
                                                    {/*<div className="cart-shop-freight">*/}
                                                    {/*运费:<span>￥0.00</span>*/}
                                                    {/*</div>*/}
                                                </div>

                                                {/*遍历商品列表*/}
                                                {
                                                    item.goodsGroup.map((items, indexs) => {
                                                        return (
                                                            <div className="cart-list-goods" key={indexs}>
                                                                {/*遍历商品数组*/}
                                                                {
                                                                    items.goodsItems.map((itemt, indext) => {
                                                                        return (
                                                                            <div className="cart-goods fixed"
                                                                                 key={indext}>
                                                                                <div className="column p-checkbox">
                                                                                    <i className={`hy-checkbox${ itemt.isSelected == 1 ? ' active' : ''}`}
                                                                                       onClick={(e) => {
                                                                                           this.changGoodsStatus(e, item.cartId, itemt.cartItemId)
                                                                                       }}></i>
                                                                                    {
                                                                                        (itemt.goodsStatus != 20 || itemt.delFlag == 1 ) || itemt.goodsQyt == 0 || itemt.goodsQyt < itemt.goodsStartNum ?
                                                                                            <span className="no-action">无效</span> : null
                                                                                    }
                                                                                </div>
                                                                                <div className="column p-goods">
                                                                                    <div className="p-img"
                                                                                         onClick={(e) => this.goProduct(e, itemt.goodsItemId)}>
                                                                                        <img src={itemt.goodsItemImg}/>
                                                                                    </div>
                                                                                    <div className="p-msg">
                                                                                        <div className="p-name"
                                                                                             onClick={(e) => this.goProduct(e, itemt.goodsItemId)}>
                                                                                            {itemt.goodsItemName}
                                                                                        </div>
                                                                                        <div className="p-extend">
                                                                                            规格:{
                                                                                            itemt.normsValue.split('+').map((itemn, indexn) => {
                                                                                                return (
                                                                                                    <em key={indexn}>{itemn}</em>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="column p-price">
                                                                                    <strong>￥{itemt.actualPrice}</strong>
                                                                                </div>
                                                                                <div className="column p-num">
                                                                                    {
                                                                                        (itemt.goodsStatus != 20 || itemt.delFlag == 1 ) || itemt.goodsQyt == 0 || itemt.goodsQyt < itemt.goodsStartNum ? null :
                                                                                            <div
                                                                                                className="quantity-form">
                                                                                                <a href="javascript: void (0)"
                                                                                                   className={`decrement${ itemt.quantity <= itemt.goodsStartNum ? ' disabled' : ''}`}
                                                                                                   onClick={(e) => this.reduceQt(e, index, indexs, indext, itemt.cartItemId)}><em>-</em></a>
                                                                                                <input type="text"
                                                                                                       className="itxt"
                                                                                                       value={itemt.quantity}
                                                                                                       onChange={(e) => this.changQts(e, index, indexs, indext)}
                                                                                                       onBlur={(e) => this.changQt(e, index, indexs, indext, itemt.cartItemId)}/>
                                                                                                <a href="javascript: void (0)"
                                                                                                   className={`increment${ parseFloat(itemt.quantity) >= ((itemt.goodsQyt - itemt.goodsStartNum) % parseFloat(itemt.goodsMultipleNum) > 0 ? itemt.goodsQyt - (itemt.goodsQyt - itemt.goodsStartNum) % parseFloat(itemt.goodsMultipleNum) : itemt.goodsQyt) ? ' disabled' : '' }`}
                                                                                                   onClick={(e) => this.addQt(e, index, indexs, indext, itemt.cartItemId)}>+</a>
                                                                                            </div>

                                                                                    }

                                                                                </div>
                                                                                <div className="column p-sum">
                                                                                    <strong>￥{(itemt.quantity * itemt.actualPrice).toFixed(2)}</strong>
                                                                                </div>
                                                                                <div className="column p-action">
                                                                                    <a href="javascript: void (0)"
                                                                                       onClick={(e) => this.deleteGood(e, itemt.cartItemId)}>删除</a>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            {/*结算*/}
                            <div className="cart-pay">
                                <div className="cart-option fixed">
                                    {/*{*/}
                                    {/*this.loseCart(carts) ?*/}
                                        <div className="select-all">
                                        <i className={`hy-checkbox select-checkbox${this.judgeTotal(carts) == 1 ? ' active' : ''}`}
                                        onClick={(e) => {
                                        this.changTotalStatus(e, carts)
                                    }}></i>
                                        <label htmlFor="select-all">全选</label>
                                        </div>
                                    {/*: null*/}
                                    {/*}*/}
                                    {/*{*/}
                                    {/*this.loseCart(carts) ?*/}
                                        <div className="operation">
                                        <a href="javascript: void (0)"
                                        onClick={(e) => this.deleteGoods(e, carts)}>删除选中的商品</a>
                                        </div>
                                    {/*: null*/}
                                    {/*}*/}
                                    <div className="tool-bar">
                                        <div className="toolbar-right">
                                            <div className="price-sum">
                                                <div>总价:<em>￥<b>{totalGoodsAmount}</b></em></div>
                                                <p>税费:<em>￥<b>{totalTaxAmount}</b></em></p>
                                            </div>
                                            <div className="btn-area">
                                                <a href="javascript: void (0)" className="submit-btn"
                                                   onClick={(e) => this.goPay(e)}>去结算</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        : null
                }

                {/*删除商品*/}
                {
                    deleteShow ?
                        <PopWinodw popup={popup} cancel={(e) => this.cancel(e)}
                                   confirm={(e) => this.confirm(e, carts)}/>
                        : null
                }

                {/*购物车为空*/}
                {
                    show ?
                        <div className="cart-empty">

                            <div className="cart-empty-tip">
                                <i><img src={require('../images/icon_ShoppingCart.png')}/></i>
                                您的购物车没有任何商品哦，快去<a href="javascript: void (0)" onClick={(e) => this.goHome(e)}>首页</a>逛逛吧~
                            </div>

                            {
                                historyList.length > 0 ?
                                    <div className="cart-history">
                                        <p>浏览历史</p>
                                        <div className="cart-history-list">
                                            <a href="javascript: void (0)" onClick={(e) => this.clickLeft(e) }
                                               className={`btn-item left-btn${_position == 0 ? ' disabled' : '' }`}></a>
                                            <div className="cart-list">
                                                <div className="cart-list-items fixed" style={{
                                                    width: 800 * historyList.length + 'px',
                                                    transform: 'translate(-' + ( 800 * _position) + 'px, 0px) translateZ(0px)',
                                                    transition: '-webkit-transform 0.3s cubic-bezier(0.333333, 0.666667, 0.666667, 1)',
                                                }}>
                                                    {
                                                        historyList.map((item, index) => {
                                                            return (
                                                                <ul key={index}>
                                                                    {
                                                                        item.map((itemt, indext) => {
                                                                            return (
                                                                                <li key={indext}
                                                                                    onClick={(e) => this.goProduct(e, itemt.id)}>
                                                                                    <div className="goods-item">
                                                                                        <i><img
                                                                                            src={itemt.goodsItemImg}/></i>
                                                                                        <div>{itemt.goodsName}</div>
                                                                                        <em>
                                                                                            <span>￥{itemt.goodsPrice}</span>
                                                                                        </em>
                                                                                        <a href="javascript: void (0)"
                                                                                           className="add-cart"
                                                                                           onClick={(e) => this.addCart(e, itemt)}>加入购物车</a>
                                                                                    </div>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                </ul>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <a href="javascript: void (0)" onClick={(e) => this.clickRight(e) }
                                               className={`btn-item right-btn${_position == historyList.length - 1 ? ' disabled' : '' }`}></a>
                                        </div>
                                    </div>
                                    : null
                            }


                        </div>
                        : null
                }

                {/*购物未登录状态*/}
                {
                    userStatus ?
                        <div className="no-login">
                            <div className="cart-empty-tip">
                                <i><img src={require('../images/icon_ShoppingCart.png')}/></i>
                                购物车内暂时没有商品，<a href="javascript: void (0)" onClick={(e) => this.goLogin(e)}>登录</a>后将显示您加入的商品
                            </div>
                        </div>
                        : null
                }

                {/*阴影层*/}
                {
                    coverShow || reshow || warningShow || addressShow || kucunShow ?
                        <div className="cover-body"></div>
                        : null
                }
                {/*库存变动弹窗*/}
                {
                    kucunShow ?
                        <PopWinodw popup={kucunTip} cancel={(e) => this.cancel(e)} custom={(e) => this.goOrder(e)}/>
                        : null
                }
                {/*库存变动弹窗*/}
                {
                    saleShow ?
                        <PopWinodw popup={saleTip} cancel={(e) => window.location.reload()} custom={(e) => window.location.reload()}/>
                        : null
                }
                {/*登录状态失效*/}
                {
                    loginShow ?
                        <PopWinodw popup={loginTip} custom={(e) => this.goLogin(e)}/>
                        : null
                }
                {/*警告提示窗*/}
                {
                    warningShow ?
                        <PopWinodw popup={popupTip} cancel={(e) => this.cancel(e)} custom={(e) => this.cancel(e)}/>
                        : null
                }
                {/*分开结算*/}
                {
                    reshow ?
                        <div className="trade">
                            <a href="javascript: void (0)" className="close" onClick={(e) => this.goBackCart(e)}></a>
                            <p className="trade-title">您需要分开结算商品</p>
                            <div className="trade-kind">
                                <span className={goodsSource == 2 ? ' active' : ''}
                                      onClick={(e) => this.choosePay(e, 2)}>海外商品<i>{overseas}</i></span>
                                <span className={goodsSource == 1 ? ' active' : ''}
                                      onClick={(e) => this.choosePay(e, 1)}>一般商品<i>{churchyard}</i></span>
                            </div>
                            <div className="trade-btn fixed">
                                <a href="javascript: void (0)" className="lf"
                                   onClick={(e) => this.goBackCart(e)}>返回购物车</a>
                                <a href="javascript: void (0)" className="rh" onClick={this.goAccount}>去结算</a>
                            </div>
                        </div>
                        : null
                }

                {/*地址弹窗展现*/}
                {
                    addressShow ?
                        <NewAddress magType={true} modify={modify} ref="child" cancal={this.cancel}
                                    btnarea={this.save}/>
                        : null
                }

                {/*客户端数据请求中*/}
                {
                    loading ? <Loading/> : null
                }

                {/*下部导航*/}
                <FooterNav/>

                <CopyRight/>

            </div>
        )
    }

}

export {Cart}