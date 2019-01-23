/*
 * 提交订单
 * */

import React, {Component} from 'react';

//引入公共组件
import {PayStatus} from '../commonviews/pay-status';
import {Loading} from '../commonviews/loading';
import {NewAddress} from '../commonviews/newAddress';
import {PopWinodw} from '../commonviews/popup-window';

//引入css
import '../styles/common.css';
import '../styles/order.css';

//引入js
import {getUser} from '../util/store';
import {encription, parseQueryString} from '../util/query';
import {ApiPost} from '../config/api';
import {toDecimal2} from '../util/util';

class Order extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false, //正在加载中
            show: false, //数据显示
            addressShow: false, //地址展现
            addressList: [],  //地址数据
            address: {}, //默认地址
            addressIdTT: 0, //修改的地址,用户判断修改地址是否为选择地址，是、则更新address
            stores: [], //店铺列表信息
            tickets: [], //券信息
            lhqId: 0, //乐虎券id
            lhqValue: 0,  //乐虎券减值
            storeDiscounts: {}, //店铺折扣
            couponDiscounts: 0,  //乐虎券折扣
            invoiceTitle: '', //发票抬头
            logisticsFare: 0, //运费
            totalGoodsPrice: 0, //商品总额
            totalTaxPrice: 0, //税费
            discountRate: 0, //会员折扣率
            promotionPrice: 0, //促销减免
            totalGoodsNum: 0,  //商品总数量
            addressId: 0, //修改地址
            magType: false, //新增还是修改  falese 修改  true 增加
            modify: {             //地址修改之前参数
                m_addressId: '',
                m_name: '',
                m_province: '',
                m_city: '',
                m_area: '',
                m_address: '',
                m_phone: '',
                idCardNumber: '',
                m_cardFrontImg: '',
                m_cardBackImg: '',
            },
            warningShow: false,
            popupTip: {
                title: '',
                btnShow: false,
            }, //警告提示窗
            certShow: false, //实名认证弹窗
            certTip: {
                title: '海关要求购买跨境商品需提供收货人身份证信息哦~',
                btnShow: false,
                knowTitle: '修改地址',
            }
        };

        //事件绑定
        this.changeAddress = this.changeAddress.bind(this);
        this.creatOrder = this.creatOrder.bind(this);
        this.chooseLqs = this.chooseLqs.bind(this);
        this.chooseStoreTicket = this.chooseStoreTicket.bind(this);
        this.modifyAddress = this.modifyAddress.bind(this);
        this.addAddress = this.addAddress.bind(this);
        this.cancel = this.cancel.bind(this);
        this.save = this.save.bind(this);
        this.parseDate = this.parseDate.bind(this);
        this.changLogistic = this.changLogistic.bind(this);

    };

    //创建订单
    creatOrder(e) {
        e.stopPropagation();
        let that = this;
        let {addressId,totalGoodsPrice, storeDiscounts, promotionPrice, address, invoiceTitle, lhqId, lhqValue,} = this.state;

        if(addressId == 0){
            console.log(2);
            this.setState({
                magType: true,
                addressShow: true,
            });
            return false;
        }

        //未实名认证手动判断添加实名认证地址
        if (that.query.goodsSource != 1 && address.isAuth != 1) {
            this.setState({
                certShow: true,
            });
            return false;
        }

        this.setState({
            loading: true
        });
        //创建店铺信息
        let stores = [];

        $('.order-list-item').each((index, item) => {
            let store = {};
            store.storeId = $(item).attr('data-storeid');
            store.ticketId = $(item).attr('data-ticketid');
            store.ticketValue = $(item).attr('data-reducevalue');
            store.goodsAmount = $(item).attr('data-goodsamount');
            store.reduceAmount = $(item).attr('data-reduceamount');
            store.buyMessage = $(item).find('textarea').val();
            let goodsGroup = store.goodsGroup = [];
            $(item).find('.order-goods-list').each((indexs, items) => {
                let goodGroup = {};
                goodGroup.freightTemplateId = $(items).attr('data-freighttemplateid');
                goodGroup.isFreeExpress = $(items).attr('data-isfreeexpress');
                goodGroup.logisticsFare = $(items).attr('data-logisticsfare');
                let goodsList = goodGroup.goodsList = [];
                $(items).find('.order-goods').each((indext, itemt) => {
                    let goods = {};
                    goods.goodsId = $(itemt).attr('data-goodsid');
                    goods.goodsItemId = $(itemt).attr('data-goodsitemid');
                    goods.reducePrice = $(itemt).attr('data-reduceprice');
                    goods.quantity = $(itemt).attr('data-quantity');
                    goodsList.push(goods);
                });
                goodsGroup.push(goodGroup);
            });
            stores.push(store);
        });
        let data = {
            userId: this.user.userId,   //用户
            strUserId: this.user.userId,
            strToken: this.user.token,
            totalGoodsPrice: totalGoodsPrice,    //商品总金额
            totalStoreTicketPrice: parseFloat(that._thunk(storeDiscounts)), //店铺优惠总金额
            totalPromotionPrice: promotionPrice,
            points: 0,
            source: 0,
            addressId: address.addressId,
            invoiceTitle: invoiceTitle,
            invoiceContent: '', //发票内容
            lhqId: lhqId,    //乐虎券id
            lhqValue: lhqValue, //乐虎券减免金额
            stores: stores,       //店铺信息
        };
        let params = {
            url: '/mobile-web-trade/ws/mobile/v1/order/create?sign=' + encription(data),
            method: 'post',
            params: data,
        };
        ApiPost(params)
            .then((data) => {
                this.setState({loading: false});
                if (data.code == 1) {
                    //支付金额不为0
                    if (data.response.isZero == 0) {
                        window.location.replace('/cashier/index.action?orderType=' + data.response.orderCode + '&totalPrice=' + data.response.totalPrice);
                    }
                    //支付金额为0
                    else if (data.response.isZero == 1) {
                        window.location.replace('/paysuccess.html?orderType=' + data.response.orderCode);
                    }
                }
                else {
                    this.setState({
                        warningShow: true,
                        popupTip: {
                            title: data.msg,
                            btnShow: false,
                        }, //警告提示窗
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    warningShow: true,
                    popupTip: {
                        title: '服务器连接超时，请重试!',
                        btnShow: false,
                    }, //警告提示窗
                })
            })
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.user = getUser();
        this.query = parseQueryString(window.location.href);
        if (this.user) {

            //请求地址
            this.apiAddressRequest();

            //从商品详情页进入
            if (this.query.from == 0) {
                this.buyNow(this.query.addressId,this.parseDate);
            }
            //从购物车进入
            else if (this.query.from == 1) {
                this.cartBuy('', this.parseDate);
            }

        }
    }

    //请求地址
    apiAddressRequest() {
        let {address, addressIdTT} = this.state;
        let that = this;
        let data = {
            userId: this.user.userId,
            strUserId: this.user.userId,
            strToken: this.user.token,
        };
        let param = {
            url: '/mobile-web-user/ws/mobile/v1/address/list?sign=' + encription(data),
            params: data,
        };
        ApiPost(param)
            .then((data) => {
                if (data.code == 1) {
                    this.setState({
                        addressList: data.response
                    }, () => {
                        if (addressIdTT == address.addressId) {
                            data.response.map((item, index) => {
                                if (item.addressId == addressIdTT) {
                                    this.setState({
                                        address: item,
                                        loading: true,
                                    },() => {
                                        if(that.query.from == 1){
                                            that.cartBuy(item.addressId, that.changLogistic);
                                        }
                                        else if(that.query.from == 0){
                                            that.buyNow(item.addressId, that.changLogistic);
                                        }
                                    });
                                    return false;
                                }
                            })
                        }
                    })
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }

    //修改地址
    modifyAddress(e, addressId, name, phone, province, city, cityId, area, address, frontImage, backImage, idCardNumber,enable) {
        e.stopPropagation();
        this.setState({
            certShow: false,
            addressIdTT: addressId,
            addressShow: true,
            magType: false,
            modify: {
                m_addressId: addressId,
                m_name: name,
                m_province: province,
                m_city: city,
                m_cityId: cityId,
                m_area: area,
                m_address: address,
                m_phone: phone,
                m_idCardNumber: idCardNumber,
                m_cardFrontImg: frontImage,
                m_cardBackImg: backImage,
                m_enable: enable,
            }
        }, () => {
            this.refs['child'].changeAreaAdress(province, city, area);
        })
    }

    //新增地址
    addAddress(e) {
        e.stopPropagation();
        this.setState({
            addressShow: true,
            magType: true,
        })
    }

    //点击保存回调事件
    save() {
        //重新刷新地址
        this.setState({
            addressShow: false,
        }, () => {
            this.apiAddressRequest();
        });
    }

    cancel() {
        this.setState({
            addressShow: false,
            warningShow: false,
            popupTip: {
                title: '',
                btnShow: false,
            }, //警告提示窗
            certShow: false,
        })
    }

    //改变发票抬头内容
    changeInvoice(e) {
        let Value = e.currentTarget.value;
        this.setState({
            invoiceTitle: Value,
        })
    }

    //从商品详情页提交结算
    buyNow(addressId,callback) {
        let that = this;
        let data = {
            userId: that.user.userId,
            strUserId: that.user.userId,
            strToken: that.user.token,
            addressId: addressId,
            goodsItemId: that.query.goodsItemId,
            goodsSource: that.query.goodsSource,
            storeId: that.query.storeId,
            quantity: that.query.quantity,
        };
        let params = {
            url: '/mobile-web-trade/ws/mobile/v1/cal/buyNow?sign=' + encription(data),
            params: data,
        };
        ApiPost(params)
            .then((data) => {
                if (data.code == 1) {
                    callback(data);
                }
                else{
                    this.setState({
                        loading: false,
                        warningShow: true,
                        popupTip: {
                            title: data.msg,
                            btnShow: false,
                        }, //警告提示窗
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    //从购物车进入
    cartBuy(addressId, callback) {
        let that = this;
        let {address,addressIdTT} = this.state;
        let data = {
            userId: that.user.userId,
            strToken: that.user.token,
            strUserId: that.user.userId,
            goodsSource: that.query.goodsSource,
            addressId: addressId != '' ? addressId : '',
        };
        let param = {
            url: '/mobile-web-trade/ws/mobile/v1/cal/doCal?sign=' + encription(data),
            params: data,
        };
        // address.name}&nbsp;&nbsp;{address.phone}&nbsp;&nbsp;{address.province}{address.city}{address.area}{address.address
        ApiPost(param)
            .then((data) => {
                if (data.code == 1 || data.code == 1700001) {
                    callback(data);
                }
                else if(addressIdTT == address.addressId){
                    if(data.code == 500004){
                        this.setState({
                            address: {
                                name: '',
                                phone: '',
                                province: '',
                                city: '',
                                area: '',
                                address: '',
                            },  // 将默认地址置空
                            addressId: 0,
                            loading: false,
                            warningShow: true,
                            popupTip: {
                                title: data.msg,
                                btnShow: false,
                            }, //警告提示窗
                        });
                    }
                }
                else{
                    this.setState({
                        loading: false,
                        warningShow: true,
                        popupTip: {
                            title: data.msg,
                            btnShow: false,
                        }, //警告提示窗
                    });
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }

    //对从购物车或者商品详情页进入的数据进行解析
    parseDate(data) {
        this.setState({
            show: true,
            address: data.response.address,
            logisticsFare: data.response.logisticsFare,
            totalGoodsPrice: data.response.totalGoodsPrice,
            totalGoodsNum: data.response.totalGoodsNum,
            stores: data.response.stores,
            addressId: data.response.address.addressId,
            discountRate: data.response.discountRate,
            totalTaxPrice: data.response.totalTaxPrice,
        }, () => {
            let tickets = [];
            for (let j = 0; j < data.response.lhqs.length; j++) {
                tickets.push(data.response.lhqs[j]);
            }
            for (let i = 0; i < data.response.stores.length; i++) {
                let storeTickets = data.response.stores[i].tickets;
                for (let j = 0; j < storeTickets.length; j++) {
                    tickets.push(storeTickets[j]);
                }
            }
            this.setState({tickets: tickets});
        })
    }

    //店铺券合计
    _thunk(storeDiscounts) {

        let storeDiscount = 0;

        for (let value in storeDiscounts) {
            storeDiscount += storeDiscounts[value];
        }
        return storeDiscount;
    }

    //选择地址
    changeAddress(e, item) {
        e.stopPropagation();
        let that = this;
        if (that.query.goodsSource != 1) {
            if (item.isAuth == 0) {
                this.setState({
                    loading: false,
                    warningShow: true,
                    popupTip: {
                        title: '海关要求购买跨境商品需提供收货人身份证信息哦~!',
                        btnShow: false,
                    }, //警告提示窗
                });
                return false;
            }
        }
        this.setState({
            loading: true,
        }, () => {
            if(that.query.from == 1){
                that.cartBuy(item.addressId, that.changLogistic);
            }
            else if(that.query.from == 0){
                that.buyNow(item.addressId, that.changLogistic);
            }
        })
    }

    //改变运费
    changLogistic(data) {
        this.setState({
            addressId: data.response.address.addressId,
            address: data.response.address,
            logisticsFare: data.response.logisticsFare,  //返回运费
            stores: data.response.stores,  //改变店铺返回的运费
            loading: false,
        })
    }

    //选择乐虎券或者乐虎券
    chooseLqs(e, userType, ticketId, reduceValue) {
        e.stopPropagation();
        let element = e.currentTarget;
        if ($(element).hasClass('disabled') || $(element).hasClass('invalid')) {
            return false;
        }
        if ($(element).hasClass('active')) {
            $('.coupon' + userType).removeClass('disabled').addClass('useof');
            $(element).removeClass('active');
            this.setState({
                lhqId: 0,
                lhqValue: 0,
                couponDiscounts: 0,
            });
            return false;
        }
        $('.coupon' + userType).removeClass('useof').addClass('disabled');
        $(element).addClass('useof active').removeClass('disabled');
        this.setState({
            lhqId: ticketId,
            lhqValue: reduceValue,
            couponDiscounts: reduceValue,
        });

    }

    //选择店铺券
    chooseStoreTicket(e, userType, ticketId, reduceValue) {
        e.stopPropagation();
        let {storeDiscounts} = this.state;
        let element = e.currentTarget;
        if ($(element).hasClass('disabled')) {
            return false;
        }
        if ($(element).hasClass('active')) {
            $('.coupon' + userType).removeClass('active disabled').addClass('useof');
            $(element).removeClass('disabled');
            storeDiscounts['store' + userType] = 0;
            this.setState({
                storeDiscounts: storeDiscounts,
            }, () => {
                $('.store' + userType).attr('data-ticketid', 0);
                $('.store' + userType).attr('data-reducevalue', 0);
            });
            return false;
        }
        $('.coupon' + userType).removeClass('useof active').addClass('disabled');
        $(element).addClass('useof active').removeClass('disabled');
        let goodsAmount = $('.store' + userType).attr('data-goodsamount');
        storeDiscounts['store' + userType] = parseFloat(goodsAmount) >= parseFloat(reduceValue) ? parseFloat(reduceValue) : parseFloat(goodsAmount);
        this.setState({
            storeDiscounts: storeDiscounts,
            lhqId: 0,
            lhqValue: 0,
            couponDiscounts: 0,
        }, () => {
            $('.coupon0').removeClass('disabled active').addClass('useof');
            $('.store' + userType).attr('data-ticketid', ticketId);
            $('.store' + userType).attr('data-reducevalue', reduceValue);
        });
    }

    componentWillUnmount() {

    }

    render() {

        const {loading, show, addressList, address, addressId, addressShow, logisticsFare, totalGoodsPrice, discountRate, totalGoodsNum, storeDiscounts, totalTaxPrice, couponDiscounts, stores, tickets, invoiceTitle, modify, magType, popupTip, warningShow, certShow, certTip} = this.state;

        //总价减去所有优惠
        let discount = parseFloat((parseFloat(totalGoodsPrice) - parseFloat(this._thunk(storeDiscounts)) - parseFloat(couponDiscounts)).toFixed(2));

        //会员率折扣价
        let discountRates = ((discountRate) * ( discount <= 0 ? 0 : discount ) ).toFixed(2);

        //总价格
        let OutOfPrice = parseFloat((parseFloat(parseFloat((discount - discountRates)) <= 0 ? 0 : parseFloat(discount - discountRates)) + parseFloat(logisticsFare) + parseFloat(totalTaxPrice)).toFixed(2));

        return (
            <div className="page">

                {/*订单状态*/}
                <div className="order">
                    {/*支付状态*/}
                    <div className="order-status">
                        <div className="order-logo" onClick={(e) => window.open('/')}></div>
                        <div className="pay-statud">
                            <PayStatus status={2}/>
                        </div>
                    </div>

                    {/*地址列表*/}
                    <div className="address">
                        <h3 className="item-title">收货地址</h3>
                        <ul className="fixed">
                            {
                                addressList.map((item, index) => {
                                    return (
                                        <li className={addressId == item.addressId ? 'active' : '' } key={index}
                                            onClick={(e) => this.changeAddress(e, item)}>
                                            <p>{item.name}{item.isAuth == 1 ? <b></b> : ''}{item.enable == 1 ?
                                                <em>默认</em> : ''}</p>
                                            <div
                                                className="address-title">{item.province}{item.city}{item.area}{item.address}</div>
                                            <div className="address-action">
                                                <a href="javascript: void (0)"
                                                   onClick={(e) => this.modifyAddress(e, item.addressId, item.name, item.phone, item.province, item.city, item.cityId, item.area, item.address, item.cardFrontImg, item.cardBackImg, item.idCardNumber,item.enable)}>修改</a>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                            <a href="javascript: void (0)" className="add-address" onClick={(e) => this.addAddress(e)}>
                                <i></i>
                                添加地址
                            </a>
                        </ul>
                    </div>

                    {/*商品信息*/}
                    {
                        show ?
                            <div className="order-goods-msg">
                                <h3 className="item-title">商品及服务信息</h3>
                                <div className="order-list">
                                    {
                                        stores.map((item, index) => {
                                            return (
                                                <div className={`order-list-item store${item.storeId}`} key={index}
                                                     data-storeid={item.storeId}
                                                     data-goodsamount={ item.goodsAmount }
                                                     data-reduceamount={ item.reduceAmount }>
                                                    {/*店铺信息*/}
                                                    <div className="order-item-thead fixed">
                                                        <div className="column fc-mo">{item.storeName}</div>
                                                        <div className="column fc-co">服务信息</div>
                                                        <div className="column fc-po">单价(元)</div>
                                                        <div className="column fc-no">数量</div>
                                                        <div className="column fc-to">小计(元)</div>
                                                    </div>
                                                    {/*商品列表信息*/}

                                                    {
                                                        item.goodsGroup.map((items, indexs) => {
                                                            return (
                                                                <div className="order-goods-list" key={indexs}
                                                                     data-freighttemplateid={ items.freightTemplateId }
                                                                     data-isfreeexpress={ items.isFreeExpress }
                                                                     data-logisticsfare={ items.logisticsFare == null ? 0 : items.logisticsFare }>
                                                                    {
                                                                        items.goodsList.map((itemt, indext) => {
                                                                            return (
                                                                                <div className="order-goods fixed"
                                                                                     key={indext}
                                                                                     data-goodsid={ itemt.goodsId }
                                                                                     data-goodsitemid={ itemt.goodsItemId }
                                                                                     data-reduceprice={ itemt.reducePirce }
                                                                                     data-quantity={ itemt.quantity }>
                                                                                    <div
                                                                                        className="goods-msg fc-mo column">
                                                                                        <i><img
                                                                                            src={itemt.goodsItemImg}/></i>
                                                                                        <div className="goods-title">
                                                                                            <p>{itemt.goodsItemName}</p>
                                                                                            <em>规格:
                                                                                                {
                                                                                                    itemt.normsValue.split('+').map((itemn, indexn) => {
                                                                                                        return (
                                                                                                            <b key={indexn}>{itemn}</b>
                                                                                                        )
                                                                                                    })
                                                                                                }
                                                                                            </em>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        className="goods-server fc-co column">
                                                                                        {
                                                                                            itemt.taxPrice > 0 ? '税费:' + itemt.taxPrice * itemt.quantity : '商家包税'
                                                                                        }
                                                                                    </div>
                                                                                    <div
                                                                                        className="goods-price fc-po column">
                                                                                        ￥{itemt.acturePrice}</div>
                                                                                    <div
                                                                                        className="goods-num fc-no column">{itemt.quantity}</div>
                                                                                    <div
                                                                                        className="goods-total-price fc-to column">
                                                                                        ￥{(itemt.quantity * itemt.acturePrice).toFixed(2)}</div>
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                    {/*留言*/}
                                                    <div className="order-other-msg fixed">
                                                        <div className="column lev-msg">
                                                            <div className="lev-msg-content">
                                                                <span>给卖家留言:<i>(0/85)</i></span>
                                                                <div className="lev-msg-title">
                                                                    <textarea placeholder="请输入留言信息"
                                                                              maxLength={85}></textarea>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="column order-total-price">
                                                            {/*<p>运费:<span>{}</span></p>*/}
                                                            <p>合计:<em>￥{item.goodsAmount}</em></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            : null
                    }

                    {/*发票信息*/}
                    {
                        show ?
                            this.query.goodsSource == 1 ?
                                <div className="invoice">
                                    <h3 className="item-title">发票信息</h3>
                                    <div className="invoice-msg">
                                        <i>发票抬头:</i>
                                        <div>
                                            <input type="text" maxLength={20} placeholder="请输入发票抬头信息"
                                                   value={invoiceTitle} onChange={(e) => this.changeInvoice(e)}/>
                                        </div>
                                    </div>
                                </div>
                                : null
                            : null
                    }

                    {/*优惠券信息*/}
                    {
                        show ?
                            <div className="coupons">
                                <h3 className="item-title">结算信息</h3>
                                {
                                    tickets.length > 0 ?
                                        <div className="coupons-list">
                                            <p>使用优惠券</p>
                                            <div className="coupons-list-wrap swiper-container swiper-no-swiping">
                                                <div className="swiper-wrapper">
                                                    {
                                                        <div className="swiper-slide fixed">
                                                            {
                                                                tickets.map((itemt, indext) => {
                                                                    return (
                                                                        itemt.storeId > 0 ?
                                                                            <div
                                                                                className={`coupon-item useof coupon${itemt.storeId}`}
                                                                                key={indext}
                                                                                onClick={(e) => this.chooseStoreTicket(e, itemt.storeId, itemt.ticketId, itemt.reduceValue)}>
                                                                                <div className="coupon-item-title">
                                                                                    <em>{itemt.storeName}</em>
                                                                                    <span><b>￥{itemt.reduceValue}</b>
                                                                                        {
                                                                                            itemt.lhqType == 1 ?
                                                                                                '现金券'
                                                                                                : itemt.lhqType == 2 ?
                                                                                                '满' + itemt.condition1 + '即可使用'
                                                                                                : null
                                                                                        }
                                                                                        </span>
                                                                                </div>
                                                                                <div className="coupon-item-time">
                                                                                    有效期:<em>{itemt.endTime}</em>
                                                                                </div>
                                                                            </div>
                                                                            :
                                                                            <div
                                                                                className={`coupon-item useof coupon${itemt.storeId}${itemt.lhqType == 2 ? parseFloat(itemt.condition1) > parseFloat(totalGoodsPrice) - parseFloat(this._thunk(storeDiscounts)) ? ' invalid' : '' : '' }`}
                                                                                key={indext}
                                                                                onClick={(e) => this.chooseLqs(e, itemt.storeId, itemt.ticketId, itemt.reduceValue)}>
                                                                                <div className="coupon-item-title">
                                                                                    <em>乐虎券</em>
                                                                                    <span><b>￥{itemt.reduceValue}</b>
                                                                                        {
                                                                                            itemt.lhqType == 1 ?
                                                                                                '现金券'
                                                                                                : itemt.lhqType == 2 ?
                                                                                                '满' + itemt.condition1 + '即可使用'
                                                                                                : null
                                                                                        }
                                                                                        </span>
                                                                                </div>
                                                                                <div className="coupon-item-time">
                                                                                    有效期:<em>{itemt.endTime}</em>
                                                                                </div>
                                                                            </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        : null
                                }
                            </div>
                            : null
                    }

                    {/*订单优惠*/}
                    {
                        show ?
                            <div className="order-price fixed">
                                <ul>
                                    <li>
                                        <span><b>{totalGoodsNum}</b>件商品，总商品金额：</span>
                                        <em>￥{toDecimal2(totalGoodsPrice)}</em>
                                    </li>
                                    <li>
                                        <span>店铺折扣：</span>
                                        <em>-￥{toDecimal2(this._thunk(storeDiscounts))}</em>
                                    </li>
                                    <li>
                                        <span>会员等级折扣：</span>
                                        <em>-￥{toDecimal2(discountRates)}</em>
                                    </li>
                                    <li>
                                        <span>运费：</span>
                                        <em>+￥{toDecimal2(logisticsFare)}</em>
                                    </li>
                                    <li>
                                        <span>税费：</span>
                                        <em>+￥{toDecimal2(totalTaxPrice)}</em>
                                    </li>
                                    <li>
                                        <span>优惠券/卡：</span>
                                        <em>-￥{toDecimal2(couponDiscounts)}</em>
                                    </li>
                                </ul>
                            </div>
                            : null
                    }

                    {/*订单信息*/}
                    {
                        show ?
                            <div className="order-msg fixed">
                                <ul>
                                    <li>
                                        <span>应付金额: </span>
                                        <em className="totalPrice">￥{toDecimal2(OutOfPrice)}</em>
                                    </li>
                                    <li>
                                        <span>收货信息: </span>
                                        <b>{address.name}&nbsp;&nbsp;{address.phone}&nbsp;&nbsp;{address.province}{address.city}{address.area}{address.address}</b>
                                    </li>
                                </ul>
                                <div className="order-submit">
                                    <i></i>下单后请尽快支付，不然订单会自动取消哦~<a href="javascript: void (0)"
                                                                  onClick={(e) => this.creatOrder(e)}>提交订单</a>
                                </div>
                            </div>
                            : null
                    }

                </div>

                {/*地址弹窗展现*/}
                {
                    addressShow ?
                        <NewAddress magType={magType} modify={modify} ref="child" cancal={this.cancel}
                                    btnarea={this.save}/>
                        : null
                }

                {/*阴影层*/}
                {
                    addressShow || certShow || warningShow ?
                        <div className="cover-body"></div>
                        : null
                }
                {/*/!*未实名认证修改信息*!/*/}
                {
                    certShow ?
                        <PopWinodw popup={certTip} cancel={(e) => this.cancel(e)}
                                   custom={(e) => this.modifyAddress(e, address.addressId, address.name, address.phone, address.province, address.city, address.cityId, address.area, address.address, address.cardFrontImg, address.cardBackImg, address.idCardNumber)}/>
                        : null
                }

                {/*提交订单加载状态*/}
                {
                    loading ? <Loading/> : null
                }


                {
                    warningShow ?
                        <PopWinodw popup={popupTip} cancel={(e) => this.cancel(e)} custom={(e) => this.cancel(e)}/>
                        : null
                }

            </div>
        )
    }
}

export {Order}