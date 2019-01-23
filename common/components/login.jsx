/*
 * 登录模块
 * */

import React, {Component} from 'react';

//引入组件
import {CopyRight} from '../commonviews/copyRight';

//引入js
import {encription, parseQueryString} from '../util/query';
import {ApiPost, ApiGet, getTimeStamp} from '../config/api';
import {checkmobile} from '../util/util';
import md5 from 'md5';
import store from 'store';

//引入样式
import '../styles/common.css';
import '../styles/login.css';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loginStyle: 1, //首页渲染展示方式
            loginRoad: 0, //0 密码登录  1 验证码登录
            userMsg: '',  //用户名
            userDelete: false, //删除电话号码状态
            userError: false, //用户名错误
            passWord: '',  //密码
            passWordDelete: false, //删除密码状态
            passWordError: false, //密码错误
            identify: '',  //验证码
            identifyDelete: false,  //删除验证码状态
            identifyFailure: false, //获取验证码状态
            identifyError: false, //验证码错误
            errorTip: false, //错误信息提示
            errorMsg: '',  //错误信息
            qrcodeImage: '', //二维码图片信息，base64
            qrcodeToken: null, //二维码token，定时检测token,
            failure: false, //二维码失效重新刷新页面
        };

        //事件绑定
        this.changeTab = this.changeTab.bind(this);
        this.goLogin = this.goLogin.bind(this);
        this.changeUser = this.changeUser.bind(this);
        this.changePassWord = this.changePassWord.bind(this);
        this.changeIndentify = this.changeIndentify.bind(this);
        this.changeLogin = this.changeLogin.bind(this);
        this.getIndentify = this.getIndentify.bind(this);
        this.refresh = this.refresh.bind(this);
        this.deleteValue = this.deleteValue.bind(this);
        this.goRegister = this.goRegister.bind(this);
        this.goForgetPassWord = this.goForgetPassWord.bind(this);
        this.goHome = this.goHome.bind(this);

    }

    //在渲染前调用,在客户端也在服务端。
    componentWillMount() {
        const {initData} = this.props;
        this.setState({
            qrcodeImage: initData.imgData,
            qrcodeToken: initData.token,
        })
    }

    //切换登录方式
    changeTab(e, index) {
        let {failure} = this.state;
        //阻止事件冒泡
        e.stopPropagation();
        this.setState({loginStyle: index});
        if (index == 1) {
            clearInterval(this.checkToken);
        }
        else {
            if (!failure) {
                this.setClock();
            }
        }
    }

    //改变用户名
    changeUser(e) {
        let VALUE = e.currentTarget.value;
        this.setState({
            userMsg: VALUE,
            userDelete: VALUE.length > 0 ? true : false,
            errorTip: false,
            errorMsg: '',
        });
    }

    //改变密码
    changePassWord(e) {
        let VALUE = e.currentTarget.value;
        this.setState({
            passWord: VALUE,
            passWordDelete: VALUE.length > 0 ? true : false,
            errorTip: false,
            errorMsg: '',
        });
    }

    //改变验证码
    changeIndentify(e) {
        let VALUE = e.currentTarget.value;
        this.setState({
            identify: VALUE,
            identifyDelete: VALUE.length > 0 ? true : false,
            errorTip: false,
            errorMsg: '',
        });
    }

    //获取验证码
    getIndentify(e) {
        //阻止事件冒泡
        e.stopPropagation();
        let {userMsg, identifyFailure} = this.state;
        //失效
        if (identifyFailure) {
            return false;
        }

        if (userMsg == '') {
            this.setState({
                errorTip: true,
                errorMsg: '请输入手机号码',
            });
            return false;
        }
        if (!checkmobile(userMsg)) {
            this.setState({
                errorTip: true,
                errorMsg: '手机号码格式不对',
            });
            return false;
        }
        let that = this;
        let data = {
            phoneCode: userMsg,
            timeStamp: getTimeStamp(),
        };
        let params = {
            url: '/mobile-web-user/ws/mobile/v1/user/getIdentifyingCode?sign=' + encription(data),
            params: data,
        };
        ApiPost(params)
            .then((data) => {
                if (data.code == 1) {
                    that.countdown(60);
                };
            })
            .catch((error) => {
                console.log(error);
            })
    }

    //倒计时
    countdown(time) {
        let that = this;
        if (time > 0) {
            $('.get-identify').text(time + 's后重发');
            this.setState({identifyFailure: true});
        } else {
            $('.get-identify').text('获取验证码');
            this.setState({identifyFailure: false});
        }
        //仅将coundown方法放入计时器
        setTimeout(function () {
            if (time > 0) {
                time--;
                that.countdown(time);
            }
        }, 1000);
    }

    //去登录
    goLogin(e) {
        e.stopPropagation();
        let {userMsg, passWord, identify, loginRoad} = this.state;
        if (userMsg == '') {
            this.setState({
                errorTip: true,
                errorMsg: '请输入手机号码',
            }, () => {
                $('.user-phone').focus();
            });
            return false;
        }
        if (!checkmobile(userMsg)) {
            this.setState({
                errorTip: true,
                errorMsg: '手机号码格式不对',
            });
            return false;
        }
        //判断登录方式
        let data;
        if (loginRoad == 0) {
            if (passWord == '') {
                this.setState({
                    errorTip: true,
                    errorMsg: '请输入密码',
                }, () => {
                    $('.pass-word').focus();
                });
                return false;
            }
            data = {
                phoneCode: userMsg,
                password: md5(passWord),
                type: 0,
                origin: 2,
                timeStamp: getTimeStamp(),
            };
        }
        else {
            if (identify == '') {
                this.setState({
                    errorTip: true,
                    errorMsg: '请输入验证码',
                }, () => {
                    $('.identify-name').focus();
                });
                return false;
            }
            data = {
                phoneCode: userMsg,
                identifyingcode: identify,
                type: 1,
                origin: 2,
                timeStamp: getTimeStamp(),
            };
        }

        let param = {
            url: '/mobile-web-pc/ws/mobile/v1/loginpc/login?sign=' + encription(data),
            params: data,
        };
        ApiPost(param)
            .then((data) => {
                if (data.code != 1) {
                    this.setState({
                        errorTip: true,
                        errorMsg: data.msg,
                    });
                }
                else {
                    store.remove('user');
                    store.set('user', data.response);
                    if(this.query.url){
                        window.location.href = this.query.url;
                    }
                    else {
                        //如果从登录页直接登录，跳转到首页
                        window.location.href = '/';
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    //切换登录方式 0 密码登录  1 验证码登录
    changeLogin() {
        let {loginRoad} = this.state;
        if (loginRoad == 0) {
            this.setState({loginRoad: 1});
        }
        else {
            this.setState({loginRoad: 0});
        }
    }

    componentDidMount() {
        let that = this;
        //页面渲染之后首先出现二维码登录方式，定时check token是否失效
        this.setClock();

        //获取参数
        this.query = parseQueryString(window.location.href);

        //对enter回车键进行事件绑定\
        document.addEventListener('keypress',function (e) {
            if(e.keyCode == 13){
                that.goLogin(e);
            }
        },false)

    }

    //刷新二维码
    refresh() {
        let that = this;
        let params = {
            url: '/mobile-web-pc/ws/mobile/v1/loginpc/showQR',
        };
        ApiGet(params)
            .then((data) => {
                this.setState({
                    failure: false,
                    qrcodeImage: data.response.imgData,
                    qrcodeToken: data.response.token,
                }, () => {
                    that.setClock();
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    //定时器
    setClock() {
        let that = this;
        this.checkToken = setInterval(() => {
            that.checkQrcode();
        }, 3000);
    }

    //定时check二维码是否失效
    checkQrcode() {
        let that = this;
        let {qrcodeToken} = this.state;
        let params = {
            url: '/mobile-web-pc/ws/mobile/v1/loginpc/checkQR?key=' + qrcodeToken,
        };
        ApiGet(params)
            .then((data) => {
                if (data.code == 2003) {
                    clearInterval(that.checkToken);
                    this.setState({failure: true});
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    //删除input数据
    deleteValue(e, index) {
        //阻止事件冒泡
        e.stopPropagation();
        if (index == 0) {
            this.setState({userMsg: '', userDelete: false});
        }
        else if (index == 1) {
            this.setState({passWord: '', passWordDelete: false});
        }
        else if (index == 2) {
            this.setState({identify: '', identifyDelete: false});
        }
    }

    //去注册
    goRegister() {
        window.open('register.html?url=' + escape(this.query.url));
    }

    //去忘记密码
    goForgetPassWord(e){
        e.stopPropagation();
        window.open('/passwordBack.html');
    }

    //去首页
    goHome(e){
        e.stopPropagation();
        window.location.href = '/';
    }

    componentWillUnmount() {
        let that = this;
        document.removeEventListener('keypress',function (e) {
            if(e.keyCode == 13){
                that.goLogin(e);
            }
        },false);
    }

    render() {

        const {loginStyle, loginRoad, qrcodeImage, failure, userMsg, userDelete, passWord, passWordDelete, errorTip, errorMsg, identify, identifyFailure, identifyDelete} = this.state;

        return (
            <div className="page">

                {/*头部*/}
                <div className="hy-login-header">
                    <div className="form-w">
                        <div className="form-logo fixed">
                            <a href="javascript: void (0)" className="home-logo" onClick={(e) => this.goHome(e)}></a>
                            <div className="logo-title">欢迎登录</div>
                        </div>
                    </div>
                </div>

                {/*login content*/}
                <div className="login-wrap">
                    <div className="login-content">
                        <div className="login-banner">
                            <img src={require('../images/login_banner.jpg')}/>
                        </div>
                        <div className="login-form">
                            <div className="login-tab login-tab-l">
                                <a href="javascript: void (0)" className={`${loginStyle == 0 ? 'active' : ''}`}
                                   onClick={(e) => this.changeTab(e, 0)}>扫码登录</a>
                            </div>
                            <div className="login-tab login-tab-r">
                                <a href="javascript: void (0)" className={`${loginStyle == 1 ? 'active' : ''}`}
                                   onClick={(e) => this.changeTab(e, 1)}>账户登录</a>
                            </div>
                            <div className="login-box">
                                {/*二维码登录*/}
                                <div className="login-style qrcode-login"
                                     style={loginStyle == 0 ? {display: 'block'} : {display: 'none'}}>
                                    <div className="qrcode-main">
                                        <div className="qrcode-img">
                                            <img src={'data:image/jpg;base64,' + qrcodeImage}/>
                                            <div className="qrcode-error-mask"
                                                 style={failure ? {display: 'block'} : {display: 'none'}}>
                                                <span>二维码已失效</span>
                                                <a href="javascript: void (0)" onClick={this.refresh}>刷新</a>
                                            </div>
                                        </div>
                                        <div className="qrcode-panel">
                                            打开<a href="javascript: void (0)">手机汇银乐虎</a>扫码二维码
                                        </div>
                                    </div>
                                </div>
                                {/*密码/验证码登录*/}
                                <div className="login-style login-pas"
                                     style={loginStyle == 1 ? {display: 'block'} : {display: 'none'}}>
                                    <div className="msg-wrap">
                                        <div className="msg-error"
                                             style={!errorTip ? {display: 'none'} : {display: 'block'}}>
                                            <b></b>
                                            <span>{errorMsg}</span>
                                        </div>
                                    </div>
                                    <div className={`item item-user`}>
                                        <label className="login-label">
                                            <img src={require('../images/login/sign-in_icon_account.png')}/>
                                        </label>
                                        <input type="text" className="itxt text user-phone" placeholder="请输入手机号码"
                                               onChange={(e) => this.changeUser(e)} value={userMsg}/>
                                        <span style={userDelete ? {display: 'block'} : {display: 'none'}}
                                              className="clear-btn" onClick={(e) => this.deleteValue(e, 0)}>
                                        </span>
                                    </div>
                                    <div className={`item item-password`}
                                         style={ loginRoad == 0 ? {display: 'block'} : {display: 'none'}}>
                                        <label className="login-label">
                                            <img src={require('../images/login/sign-in_icon_password.png')}/>
                                        </label>
                                        <input type="password" className="itxt text pass-word" placeholder="请输入密码"
                                               onChange={(e) => this.changePassWord(e)} value={passWord}/>
                                        <span style={passWordDelete ? {display: 'block'} : {display: 'none'}}
                                              className="clear-btn" onClick={(e) => this.deleteValue(e, 1)}>
                                        </span>
                                    </div>
                                    <div className="item item-identify"
                                         style={ loginRoad == 1 ? {display: 'block'} : {display: 'none'}}>
                                        <label className="login-label">
                                            <img src={require('../images/login/sign-in_icon_password.png')}/>
                                        </label>
                                        <input type="text" className="itxt text identify-name" placeholder="输入验证码"
                                               onChange={(e) => this.changeIndentify(e)} value={identify}/>
                                        <span style={ identifyDelete ? {display: 'block'} : {display: 'none'}}
                                              className="clear-btn" onClick={(e) => this.deleteValue(e, 2)}>
                                        </span>
                                        <a className={`get-identify${identifyFailure ? ' disabled' : ''}`}
                                           onClick={(e) => this.getIndentify(e)}>获取验证码</a>
                                    </div>
                                    <div className="item-fore">
                                        <a href="javascript: void (0)"
                                           onClick={this.changeLogin}>{loginRoad == 0 ? '验证码登录' : '密码登录' }</a>
                                        <a href="javascript: void (0)" className="forget-password" onClick={(e) => this.goForgetPassWord(e)}>忘记密码</a>
                                    </div>
                                    <a href="javascript: void (0)" className="login-btn" onClick={(e) => this.goLogin(e)}>登录</a>
                                </div>
                                <div className="register-form">
                                    <a href="javascript: void (0)" onClick={this.goRegister}>免费注册 有惊喜</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*底部导航*/}
                <CopyRight/>

            </div>
        )
    }

}

export {Login}