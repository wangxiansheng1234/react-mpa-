/*
 * 最顶端导航
 * */

import React, {Component} from 'react';

import '../styles/common/header-top.css';

//引入js
import {encription} from '../util/query';
import {ApiPost} from '../config/api';
import {getUser} from '../util/store';
import store from 'store';

class HeaderTop extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false, //显示登录状态
            userName: '',
        };

        //事件绑定
        this.goEnter = this.goEnter.bind(this);
        this.goLogin = this.goLogin.bind(this);
        this.goRegister = this.goRegister.bind(this);
        this.goOrderList = this.goOrderList.bind(this);
        this.exit = this.exit.bind(this);

    }

    componentWillMount() {
        this.user = getUser();
        if (this.user) {
            this.apiRequest();
        }
    }

    componentDidMount() {

    }

    //登录状态
    apiRequest() {
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
                    this.setState({
                        show: true,
                        userName: data.response.userVO.nickName,
                    })
                }
                else if(data.code == -10){
                    store.remove('user');
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }

    //去个人中心
    goEnter(e) {
        e.stopPropagation();
        let {show} = this.state;
        if(!show){
            window.open('/login.html?url=' + escape(window.location.host + '/personal.html') );
        }
        else {
            window.open('/personal.html');
        }
    }

    //去登录
    goLogin(e) {
        e.stopPropagation();
        window.location.href = '/login.html?url=' + escape(window.location.href);
    }

    //退出登录
    exit(){
        store.remove('user');
        window.location.href = '/login.html?url=' + escape(window.location.href);
    }

    //去注册
    goRegister(e) {
        e.stopPropagation();
        window.location.href = '/register.html?url=' + escape(window.location.href);
    }

    //去我的订单列表
    goOrderList() {
        let {show} = this.state;
        if (show) {
            window.open('/orderManage.html');
        }
        else {
            window.open('/login.html?url=' + escape('/orderManage.html') );
        }
    }

    componentWillUnmount() {

    }

    render() {

        const {show, userName} = this.state;

        return (
            <div className="hy-header">
                <div className="hy-shortcut">
                    <div className="hy-w fixed">
                        <ul className="fl">
                            <li><a href="javascript: void (0)">招商加盟</a></li>
                            <li><a href="javascript: void (0)">关于我们</a></li>
                        </ul>
                        <ul className="fr">
                            {
                                !show ?
                                    <li><a href="javascript: void (0)" onClick={(e) => this.goRegister(e)}>注册有礼</a></li>
                                    : null
                            }
                            {
                                !show ?
                                    <li><a href="javascript: void (0)" onClick={(e) => this.goLogin(e)}>请登录</a></li>
                                    : null
                            }
                            {
                                show ?
                                    <li className="active"><a href="javascript: void (0)" onClick={(e) => this.goEnter(e)}>{userName}</a></li>
                                    : null
                            }
                            {
                                show ?
                                    <li className="active"><a href="javascript: void (0)" onClick={(e) => this.exit(e)}>退出</a></li>
                                    : null
                            }
                            <li><a href="javascript: void (0)" onClick={(e) => this.goOrderList(e)}>我的订单</a></li>
                            <li className="tel"><a href="javascript: void (0)" className="tel-phone">手机汇银
                                <div className="qb">
                                    <i><img src={require('../images/erweima.png')}/></i>
                                    <em>
                                        <span>手机汇银</span>
                                        <b>下载汇银APP<br/>有惊喜哦!</b>
                                    </em>
                                </div>
                            </a></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export {HeaderTop}