/*
* 个人资料模块
* */

import React, {Component} from 'react';

import '../styles/common.css';
import '../styles/personal.css';
import {encription} from "../util/query";
import {ApiPost} from "../config/api";
import {getUser} from '../util/store';

//引入组件
import {HeaderTop} from '../commonviews/header-top';
import {Nav} from '../commonviews/nav';
import {Mask} from '../commonviews/mask';
import {NewAddress} from '../commonviews/newAddress';
import {PopWinodw} from '../commonviews/popup-window';


class Personal extends Component {
    static defaultProps = {
        pageType: {
            pageStatus: 0,//0/账户中心 ,1/订单管理
            t_pageStatus: false, //订单详情页面
        },
        popup: {
            title: '确定要删除该地址吗?',
            btnShow: true,
            leftBtn: '确认',
            rightBtn: '取消',
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            current: 1, //1賬戶信息，2店鋪信息，3地址管理
            userName: [],//账户信息
            storeInfo: [],//店铺信息数据
            addressData: [],//地址管理数据
            magShow: false, //新增弹出窗
            picmax: false,//图片放大效果
            picMaxUrl: "",//放大图片地址
            picShow: false,//图片放大遮罩层
            magType: true,//弹窗类型
            em_show: false, //修改/删除/设为默认显隐
            deleteShow: false, //删除弹窗
            a_index: '',//地址索引值
            a_addressId: "",//地址id
            modify: {             //修改之前参数
                m_addressId: '',
                m_name: '',
                m_province: '',
                m_city: '',
                m_area: '',
                m_cityId: '',
                m_address: '',
                m_phone: '',
                m_cardFrontImg: '',
                m_cardBackImg: '',
                m_enable: '',
            },
        };

        //綁定事件
        this.tabClick = this.tabClick.bind(this);
        this.resetLogin = this.resetLogin.bind(this);
        this.deletead = this.deletead.bind(this);
        this.newlyAdded = this.newlyAdded.bind(this);
        this.cancal = this.cancal.bind(this);  // 新增/修改弹窗关闭事件
        this.cancel = this.cancel.bind(this); //删除弹窗关闭事件
        this.picMax = this.picMax.bind(this);
        this.picMaxHide = this.picMaxHide.bind(this);
        this.modifyAdded = this.modifyAdded.bind(this);
        this.BtnArea = this.BtnArea.bind(this);
        this.setDefaultAddress = this.setDefaultAddress.bind(this);
        this.confirm = this.confirm.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        let that = this;
        //获取user
        this.user = getUser();
        //获取用户信息数据
        if (this.user) {
            that.apiRequest();
        }
    }

    componentWillUnmount() {

    }

    //账户信息接口数据请求
    apiRequest() {
        let that = this;
        let data = {
            userId: this.user.userId,
            strUserId: this.user.userId,
            strToken: this.user.token,
        };
        let param = {
            url: '/mobile-web-user/ws/mobile/v1/user/getUserinfo?sign=' + encription(data),
            params: data,
        };
        ApiPost(param)
            .then((data) => {
                if (data.code == 1) {
                    /*console.log("1" + data.response);*/
                    that.setState({
                        userName: data.response.userVO,
                    })
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }

    //店铺信息接口数据请求
    apiRequestShop() {
        let that = this;
        let data = {
            userStoreId: '',
            userId: this.user.userId,
            strUserId: this.user.userId,
            strToken: this.user.token,
        };
        let param = {
            url: '/mobile-web-user/ws/mobile/v1/user/getUserStoreInfo?sign=' + encription(data),
            params: data,
        };
        ApiPost(param)
            .then((data) => {
                if (data.code == 1) {
                    /* console.log("2" + data.response);*/
                    that.setState({
                        storeInfo: data.response.userStoreVO,
                    })
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }

    //地址接口数据请求
    apiRequestAddress() {
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
                    /*  console.log("3" + data.response);*/
                    that.setState({
                        addressData: data.response,
                    })
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }


    //tab切换
    tabClick(e, index) {
        let that = this;
        this.setState({
            current: index,
        });
        if (index == 1) {

            that.apiRequest();

        } else if (index == 2) {

            that.apiRequestShop();

        } else if (index == 3) {

            that.apiRequestAddress();
        }
    }

    //重置登录跳转
    resetLogin(e, userName) {
        window.location.href = "/passwordBack.html?userName=" + escape(userName);
    }

    //删除地址
    deletead(e, index, addressId) {
        let that = this;
        that.setState({
            a_index: index,
            a_addressId: addressId,
            deleteShow: true,
        });
    }

    //确认删除
    confirm(e) {
        e.stopPropagation();
        const {addressData, a_index, a_addressId} = this.state;
        let data = {
            id: a_addressId,
            userId: this.user.userId,
            strUserId: this.user.userId,
            strToken: this.user.token,
        };
        let param = {
            url: '/mobile-web-user/ws/mobile/v1/address/deleteOne?sign=' + encription(data),
            method: 'post',
            params: data,
        };

        ApiPost(param)
            .then((data) => {
                if (data.code == 1) {
                    addressData.splice(a_index, 1);
                    this.setState({
                        addressData,
                        deleteShow: false,
                    });
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }

    //取消删除
    cancel(e) {
        e.stopPropagation();
        this.setState({
            deleteShow: false,
            popupTip: {
                title: '',
                leftBtn: '',
                rightBtn: '',
                btnShow: false,
            }, //警告提示窗
        })
    }

    //新增地址
    newlyAdded(e) {
        let that = this;
        that.setState({
            magType: true,
            magShow: true,
        })
    }

    //修改地址
    modifyAdded(e, addressId, name, province, city, cityId, area, address, phone, idCardNumber, cardFrontImg, cardBackImg, enable) {
        let that = this;

        that.setState({
            magType: false,
            magShow: true,
            modify: {             //修改之前参数
                m_addressId: addressId,
                m_name: name,
                m_address: address,
                m_phone: phone,
                m_province: province,
                m_city: city,
                m_cityId: cityId,
                m_area: area,
                m_idCardNumber: idCardNumber,
                m_cardFrontImg: cardFrontImg,
                m_cardBackImg: cardBackImg,
                m_enable: enable,
            },
        }, () => {
            this.refs['child'].changeAreaAdress(province, city, area);
        })

    }

    //关闭新增//编辑弹窗
    cancal() {
        let that = this;
        that.setState({
            magShow: false,
        })
    }

    //点击遮罩层消失
    picMaxHide() {
        let that = this;
        that.setState({
            picmax: false,
            picShow: false,
        })
    }

    //图片放大功能
    picMax(e, url) {
        let that = this;
        that.setState({
            picmax: true,
            picShow: true,
            picMaxUrl: url,
        })
    }

    //子组件改变父组件state
    BtnArea(...arg) {
        let that = this;
        that.setState({
            magShow: false,
            current: 3,
        }, (e) => {
            that.apiRequestAddress();
        });
    }

    //设置默认地址
    setDefaultAddress(e, addressId) {
        let that = this;
        let data = {
            id: addressId,
            userId: this.user.userId,
            strUserId: this.user.userId,
            strToken: this.user.token,
            setdefault: 1,
        };
        let param = {
            url: '/mobile-web-user/ws/mobile/v1/address/setdefaultAddress?sign=' + encription(data),
            method: 'post',
            params: data,
        };
        ApiPost(param)
            .then((data) => {
                if (data.code == 1) {
                    that.apiRequestAddress();
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }

    //移入显示
    museOver() {
        let that = this;
        that.setState({
            em_show: true,
        });
    }

    //隐藏
    mouseOut() {
        let that = this;
        that.setState({
            em_show: false,
        });
    }

    render() {
        let that = this;
        const {current, userName, storeInfo, addressData, magShow, picmax, picMaxUrl, picShow, magType, modify, deleteShow} = this.state;
        const {pageType, popup} = this.props;
        return (
            <div className="page">
                {/*顶部*/}
                <HeaderTop/>

                {/*导航栏*/}
                <Nav pageType={pageType}/>

                <div className="content">
                    <div className="c-title w">
                        <h2>个人资料 {userName.checkStatus == 0 ?
                            <em>你的注册资料正在审核&nbsp;(&nbsp;1-3个工作日&nbsp;)&nbsp;,&nbsp;请耐心等待&nbsp;!</em> : userName.checkStatus == 1 ? "" : userName.checkStatus == 2 ?
                                <em>{userName.remarks}</em> : ""}
                        </h2>
                        <ul>
                            <li className={current === 1 ? "li-active" : ""} onClick={(e) => that.tabClick(e, 1)}>
                                账户信息 <span className={current === 1 ? "span-active" : ""}></span>
                            </li>
                            <li className={current === 2 ? "li-active" : ""} onClick={(e) => that.tabClick(e, 2)}>
                                店铺信息 <span className={current === 2 ? "span-active" : ""}></span>
                            </li>
                            <li className={current === 3 ? "li-active" : ""} onClick={(e) => that.tabClick(e, 3)}>
                                地址管理 <span className={current === 3 ? "span-active" : ""}></span>
                            </li>
                        </ul>
                    </div>
                    <ul className="tab w">
                        {
                            current == 1 ? <li>
                                <div className="account">
                                    <div className="card">
                                        <div className="card-info">
                                            <div className="card-info-t">
                                                <img src={userName.userUrl}/>
                                                <div className="cardNumber">
                                                    <em>{userName.userName}</em>
                                                    {
                                                        userName.userGradeName != "普通会员" ?
                                                            <img src={require('../images/personal/vip.png')}/> : null
                                                    }
                                                </div>
                                            </div>
                                            <div className="card-info-d">
                                                <div className="balance">
                                                    <span>会员卡余额:</span>
                                                    <p><i>￥</i>{userName.balance}</p>
                                                </div>
                                                <ul className="phoneNumber">
                                                    <li><span>手机号&nbsp;:&nbsp;</span>{userName.userName}</li>
                                                    <li><span>会员身份&nbsp;:&nbsp;</span>{userName.userGradeName}</li>
                                                </ul>
                                            </div>
                                            {/* <div className="msg">
                                                <em>点击开通</em>
                                                <em>尊贵特权</em>
                                            </div>*/}
                                        </div>
                                        <div className="password">
                                            <div className="password-item">
                                                <span>登录密码&nbsp;:&nbsp;</span>
                                                <em>***********</em>
                                                <div onClick={(e) => that.resetLogin(e, userName.userName)}>
                                                    修改登录密码
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li> : null
                        }
                        {
                            current == 2 ? <li>
                                <div className="shop">
                                    <ul>
                                        <li><span>店铺名称&nbsp;:&nbsp;</span><em>{storeInfo.storeName}</em>
                                        </li>
                                        <li><span>店主姓名&nbsp;:&nbsp;</span><em>{storeInfo.ownerName}</em></li>
                                        <li>
                                            <span>店铺所在地&nbsp;:&nbsp;</span><em>{storeInfo.address}</em>
                                        </li>
                                        <li><span>推荐人&nbsp;:&nbsp;</span><em>{storeInfo.referrer}</em></li>
                                        <li className="last-chird">
                                            <span>店铺照片&nbsp;:&nbsp;</span>
                                            {
                                                storeInfo.storeType == 1 ?
                                                    <div>
                                                        {
                                                            storeInfo.storeFrontUrl != "" ?
                                                                <img src={storeInfo.storeFrontUrl}
                                                                     onClick={(e) => that.picMax(e, storeInfo.storeFrontUrl)}/> :
                                                                null
                                                        }
                                                        {
                                                            storeInfo.licenseUrl != "" ?
                                                                <img src={storeInfo.licenseUrl}
                                                                     onClick={(e) => that.picMax(e, storeInfo.licenseUrl)}/> :
                                                                null
                                                        }
                                                    </div> : storeInfo.storeType == 2 ? <div>
                                                        {
                                                            storeInfo.storeBackendUrl != "" ?
                                                                <img src={storeInfo.storeBackendUrl}
                                                                     onClick={(e) => that.picMax(e, storeInfo.storeBackendUrl)}/> : null
                                                        }
                                                        {
                                                            storeInfo.cardFrontUrl != "" ?
                                                                <img src={storeInfo.cardFrontUrl}
                                                                     onClick={(e) => that.picMax(e, storeInfo.cardFrontUrl)}/> : null
                                                        }
                                                        {
                                                            storeInfo.cardBackUrl != "" ?
                                                                <img src={storeInfo.cardBackUrl}
                                                                     onClick={(e) => that.picMax(e, storeInfo.cardBackUrl)}/> : null
                                                        }

                                                    </div> : null

                                            }
                                        </li>
                                    </ul>
                                </div>
                            </li> : null
                        }
                        {
                            current == 3 ? <li className="no-pad">
                                <ul className="address">
                                    {
                                        addressData instanceof Array && addressData.length > 0 ?
                                            addressData.map((item, index) => {
                                                return (
                                                    <li key={index}
                                                        className={item.enable == 1 ? "default-active" : ""}>
                                                        <div className="name">
                                                            <em>{item.name}</em>
                                                            <em>{item.province} &nbsp;{item.city}</em>
                                                            {item.isAuth == 1 ? <img
                                                                    src={require('../images/personal/realName.png')}/> :
                                                                null
                                                            }
                                                            {item.enable == 1 ? <img
                                                                src={require('../images/personal/icon_moren.png')}/> : null
                                                            }
                                                        </div>
                                                        <div className="detailed">{item.address}&nbsp;</div>
                                                        <div className="operation">
                                                            <em onClick={(e) => that.modifyAdded(e, item.addressId, item.name, item.province, item.city, item.cityId, item.area, item.address, item.phone, item.idCardNumber, item.cardFrontImg, item.cardBackImg, item.enable)}>修改</em>
                                                            <em
                                                                onClick={(e) => that.deletead(e, index, item.addressId)}>删除</em>
                                                            {item.enable == 0 ?
                                                                <em onClick={(e) => that.setDefaultAddress(e, item.addressId)}>设为默认</em> : null
                                                            }
                                                            <i>{(item.phone).substr(0, 3) + '****' + (item.phone).substr(7)}</i>
                                                        </div>
                                                    </li>
                                                )
                                            }) : null
                                    }
                                    <li>
                                        <div className="upload" onClick={(e) => that.newlyAdded(e)}>
                                            <img src={require('../images/personal/icon_Add_location.png')}/>
                                            <b>添加新地址</b>
                                        </div>
                                    </li>
                                </ul>
                            </li> : null
                        }
                    </ul>
                </div>

                {/*<!--弹出窗-->*/}
                {
                    picShow || magShow ? <Mask picMaxHide={this.picMaxHide}/> : null
                }
                {
                    magShow ? <NewAddress magType={magType} modify={modify} modifyAdded={this.modifyAdded}
                                          cancal={this.cancal} btnarea={this.BtnArea} ref="child"/> : null
                }
                {
                    picmax ? <div className="pictureMax">
                        <img src={picMaxUrl}/>
                    </div> : null
                }

                {/*删除地址确认弹窗*/}
                {
                    deleteShow ?
                        <PopWinodw popup={popup} cancel={(e) => this.cancel(e)}
                                   confirm={(e) => this.confirm(e,)}/>
                        : null
                }

            </div>
        )
    }

}

export {Personal}

