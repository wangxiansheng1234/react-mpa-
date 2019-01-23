/*
* 修改密码模块
* */

import React, {Component} from 'react';

import '../styles/common.css';
import '../styles/passwordBack.css';

import {encription, parseQueryString} from "../util/query";
import {ApiPost, ApiGet, getTimeStamp} from "../config/api";
import {getUser} from '../util/store';
import {checkmobile} from "../util/util";
import md5 from 'md5';

//加载组件
import {FooterNav} from '../commonviews/footer';


class PasswordBack extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modularShow: 1, //1输入账户名, 2验证身份, 3重置密码, 4重置成功
            modularType: 1, //忘记密码, 2修改密码,
            userName: '', //忘记密码
            imgData: '',//条形码
            account: {
                phone: '',  //手机号
                token: '',
                barCode: '',  //条形码
                verificationCode: '', //验证码
                newPassword: '', //新密码
                confirmNewPassword: '', //确认新密码
            },
        };

        //綁定事件
        this.InvisibilityClick = this.InvisibilityClick.bind(this);
        this.imgInvisibilityClick = this.imgInvisibilityClick.bind(this);
        this.changePhone = this.changePhone.bind(this);
        this.focusPhone = this.focusPhone.bind(this);
        this.changeBarCode = this.changeBarCode.bind(this);
        this.focusBarCode = this.focusBarCode.bind(this);
        this.accountNextStep = this.accountNextStep.bind(this);
        this.obtainClck = this.obtainClck.bind(this);
        this.changeVerification = this.changeVerification.bind(this);
        this.focusVerification = this.focusVerification.bind(this);
        this.authenticateNextStep = this.authenticateNextStep.bind(this);
        this.newPassword = this.newPassword.bind(this);
        this.focusNewPassword = this.focusNewPassword.bind(this);
        this.confirmNewPassword = this.confirmNewPassword.bind(this);
        this.focusConfirmNewPassword = this.focusConfirmNewPassword.bind(this);
        this.passwordVerification = this.passwordVerification.bind(this);
        this.goShopping = this.goShopping.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        let that = this;

        //获取user
        this.user = getUser();

        //获取url参数
        this.queryAgr = parseQueryString(window.location.href);
        if (this.queryAgr.userName != undefined) {
            that.setState({
                modularType: 2,
                userName: unescape(this.queryAgr.userName),
            })
        }


        //获取条形验证码
        that.apiRequest();

    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    //账户信息接口数据请求
    apiRequest() {
        let that = this;
        let {account} = this.state;
        let data = {
            timeStamp: getTimeStamp(),
        };
        let param = {
            url: '/mobile-web-pc/ws/mobile/v1/loginpc/verifyImage',
            params: data,
        };
        ApiGet(param)
            .then((data) => {
                if (data.code == 1) {
                    account.token = data.response.token;
                    that.setState({
                        imgData: data.response.imgData,
                        account,
                    })
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }

    //图片点击看不清
    imgInvisibilityClick(e) {
        let that = this;
        //获取条形验证码
        that.apiRequest();
    }

    //点击看不清
    InvisibilityClick(e) {
        let that = this;
        //获取条形验证码
        that.apiRequest();
    }

    //添加手机号
    changePhone(e) {
        let {account} = this.state;
        let Phone = e.currentTarget.value;
        account.phone = Phone;
        this.setState({account});
    }

    //获得焦点
    focusPhone(e) {
        document.querySelector(".msg_f").children[1].innerHTML = '';
        document.querySelector(".msg_f").style.display = 'none';
    }

    //添加验证码
    changeBarCode(e) {
        let {account} = this.state;
        let barCode = e.currentTarget.value;
        account.barCode = barCode;
        this.setState({account});
    }

    //获得焦点
    focusBarCode(e) {
        document.querySelector(".msg_t").children[1].innerHTML = '';
        document.querySelector(".msg_t").style.display = 'none';
    }

    //下一步
    accountNextStep() {
        let that = this;
        let {account, modularType, userName} = this.state;
        if (modularType == 1) {
            if (account.phone.replace(/\s/g, "") == '') {
                document.querySelector(".msg_f").children[1].innerHTML = '手机号不能为空';
                document.querySelector(".msg_f").style.display = 'block';
                return false
            }

            if (!checkmobile(account.phone)) {
                document.querySelector(".msg_f").children[1].innerHTML = '请输入有效的手机号';
                document.querySelector(".msg_f").style.display = 'block';
                return false
            }
        }

        if ((account.barCode) == '') {
            document.querySelector(".msg_t").children[1].innerHTML = '验证码不能为空';
            document.querySelector(".msg_t").style.display = 'block';
            return false
        }

        let data = {
            phoneCode: modularType == 2 ? userName : account.phone,
            key: account.token,
            code: account.barCode,
        };
        let param = {
            url: '/mobile-web-pc/ws/mobile/v1/loginpc/checkVerifyImage',
            params: data,
        };
        ApiGet(param)
            .then((data) => {
                if (data.code == 0) {

                    document.querySelector(".msg_f").children[1].innerHTML = data.msg;
                    document.querySelector(".msg_f").style.display = 'block';
                } else if (data.code == -4) {

                    document.querySelector(".msg_f").children[1].innerHTML = data.msg;
                    document.querySelector(".msg_f").style.display = 'block';

                } else if (data.code == -1) {

                    document.querySelector(".msg_f").children[1].innerHTML = data.msg;
                    document.querySelector(".msg_f").style.display = 'block';
                } else if (data.code == 1) {

                    that.setState({
                        modularShow: 2,
                    })
                } else if (data.code == 100012) {

                    document.querySelector(".msg_t").children[1].innerHTML = data.msg;
                    document.querySelector(".msg_t").style.display = 'block';
                } else if (data.code == 100014) {

                    document.querySelector(".msg_t").children[1].innerHTML = data.msg;
                    document.querySelector(".msg_t").style.display = 'block';
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }

    //获取验证码
    obtainClck(e) {
        let that = this;
        let {account, modularType, userName} = this.state;
        document.querySelector(".msg_th").children[1].innerHTML = '';
        document.querySelector(".msg_th").style.display = 'none';
        that.countdown(60);
        let data = {
            phoneCode: modularType == 2 ? userName : account.phone,
        };
        let param = {
            url: '/mobile-web-pc/ws/mobile/v1/loginpc/getIdentifyingCode?sign=' + encription(data),
            method: 'post',
            params: data,
        };
        ApiPost(param)
            .then((data) => {
                if (data.code == 1) {
                    console.log(data.msg);
                } else {
                    console.log(data.msg);
                    //发送错误后，立即重置。
                    that.countdown(0);
                }
            })
            .catch((error) => {
                console.log('服务器错误');
                //发送错误后，立即重置。
                that.countdown(0);
            })
    }

    //倒计时
    countdown(time) {
        let that = this;
        if (time == 0) {
            clearTimeout(this.timer);
            document.querySelector('.verificationCode').innerHTML = '获取验证码';
            document.querySelector('.verificationMask').style.display = 'none';

        } else if (time > 0) {
            document.querySelector('.verificationCode').innerHTML = time + ' s后重发';
            document.querySelector('.verificationMask').style.display = 'block';
        } else {
            document.querySelector('.verificationCode').innerHTML = '获取验证码';
            document.querySelector('.verificationMask').style.display = 'none';
        }
        //仅将coundown方法放入计时器
        this.timer = setTimeout(function () {
            if (time > 0) {
                time--;
                that.countdown.call(that, time);
            }
        }, 1000);

    }

    //添加验证码
    changeVerification(e) {
        let {account} = this.state;
        let verification = e.currentTarget.value;
        account.verificationCode = verification;
        this.setState({account});
    }

    //验证码获得焦点
    focusVerification(e) {
        document.querySelector(".msg_th").children[1].innerHTML = '';
        document.querySelector(".msg_th").style.display = 'none';
    }

    // 验证身份下一步
    authenticateNextStep(e) {
        let that = this;
        let {account, modularType, userName} = this.state;
        let data = {
            phoneCode: modularType == 2 ? userName : account.phone,   //手机号码
            code: account.verificationCode,   // 短信验证码
        };
        let param = {
            url: '/mobile-web-pc/ws/mobile/v1/loginpc/checkIdentifyingcode',
            params: data,
        };
        ApiGet(param)
            .then((data) => {
                if (data.code == -4) {

                    document.querySelector(".msg_th").children[1].innerHTML = '验证码不能为空!';
                    document.querySelector(".msg_th").style.display = 'block';

                } else if (data.code == 0) {

                    document.querySelector(".msg_th").children[1].innerHTML = '验证码错误,请重新输入!';
                    document.querySelector(".msg_th").style.display = 'block';

                } else if (data.code == 1) {

                    that.countdown(0);
                    that.setState({
                        modularShow: 3,
                    })
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }

    //添加新密码
    newPassword(e) {
        let {account} = this.state;
        let newPassword = e.currentTarget.value;
        account.newPassword = newPassword;
        this.setState({account});
    }

    //获得焦点
    focusNewPassword(e) {
        document.querySelector(".msg_fo").children[1].innerHTML = '';
        document.querySelector(".msg_fo").style.display = 'none';
    }

    //确认新密码
    confirmNewPassword(e) {
        let {account} = this.state;
        let confirmNewPassword = e.currentTarget.value;
        account.confirmNewPassword = confirmNewPassword;
        this.setState({account});
    }

    //确认新密码获得焦点
    focusConfirmNewPassword(e) {
        document.querySelector(".msg_fi").children[1].innerHTML = '';
        document.querySelector(".msg_fi").style.display = 'none';
    }

    //密码验证下一步
    passwordVerification(e) {
        let that = this;
        let {account, modularType, userName} = this.state;

        if (account.newPassword == '') {
            document.querySelector(".msg_fo").children[1].innerHTML = '新密码不能为空!';
            document.querySelector(".msg_fo").style.display = 'block';
            return false;
        }

        if (account.newPassword.length < 6) {
            document.querySelector(".msg_fo").children[1].innerHTML = '密码不能小于6位数!';
            document.querySelector(".msg_fo").style.display = 'block';
            return false;
        }
        if (account.newPassword.length > 18) {
            document.querySelector(".msg_fo").children[1].innerHTML = '密码不能大于18位数!';
            document.querySelector(".msg_fo").style.display = 'block';
            return false;
        }

        if (account.confirmNewPassword == '') {
            document.querySelector(".msg_fi").children[1].innerHTML = '确认密码不能为空!';
            document.querySelector(".msg_fi").style.display = 'block';
            return false;
        }

        if (account.newPassword != account.confirmNewPassword) {
            document.querySelector(".msg_fi").children[1].innerHTML = '两次输入密码不一致!';
            document.querySelector(".msg_fi").style.display = 'block';
            return false;
        }

        let data = {
            phoneCode: modularType == 2 ? userName : account.phone,
            newpassword: md5(account.newPassword),  //新密码
            /*userId: this.user.userId,
            strUserId: this.user.userId,
            strToken: this.user.token,*/
            timeStamp: getTimeStamp(),
        };
        let param = {
            url: '/mobile-web-pc/ws/mobile/v1/loginpc/resetPassword?sign=' + encription(data),
            method: 'post',
            params: data,
        };
        ApiPost(param)
            .then((data) => {
                if (data.code == 0) {
                    document.querySelector(".msg_fi").children[1].innerHTML = data.msg;
                    document.querySelector(".msg_fi").style.display = 'block';
                } else if (data.code == 1) {
                    that.setState({
                        modularShow: 4,
                    })
                } else {
                    console.log(data.msg);
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }

    //去首页
    goShopping(e) {

        window.location.href = "/";
    }

    render() {
        let that = this;
        const {modularShow, modularType, userName, imgData, account} = this.state;

        return (
            <div className="page">
                <div className="content">
                    <div className="logo w">
                        <img src={require('../images/home_image_logo.png')} onClick={(e) => that.goShopping(e)}/>
                        <em>{modularType == 1 ? "忘记密码" : modularType == 2 ? "修改密码" : null} </em>
                    </div>
                    <div className="c-title">
                        <div className="shadow"></div>
                        <ul className="w">
                            <li>
                                <i className={modularShow == 1 ? 'i-active' : ''}>1</i>
                                <em className={modularShow == 1 ? 'em-active' : ''}>输入账户名</em>
                                <span className={modularShow == 1 ? 'span-active' : ''}></span>
                            </li>
                            <li>
                                <i className={modularShow == 2 ? 'i-active' : ''}>2</i>
                                <em className={modularShow == 2 ? 'em-active' : ''}>验证身份</em>
                                <span className={modularShow == 2 ? 'span-active' : ''}></span>
                            </li>
                            <li>
                                <i className={modularShow == 3 ? 'i-active' : ''}>3</i>
                                <em className={modularShow == 3 ? 'em-active' : ''}>重置密码</em>
                                <span className={modularShow == 3 ? 'span-active' : ''}></span>
                            </li>
                            <li>
                                <i className={modularShow == 4 ? 'i-active' : ''}>4</i>
                                <em className={modularShow == 4 ? 'em-active' : ''}>重置成功</em>
                                <span className={modularShow == 4 ? 'span-active' : ''}></span>
                            </li>
                        </ul>
                    </div>
                    <ul className="tab w">
                        {modularShow == 1 ?
                            <li>
                                <ul className="account">
                                    <li>
                                        <span>手机号码&nbsp;:&nbsp;</span>
                                        <input className="txt-phone"
                                               onChange={(e) => that.changePhone(e)}
                                               onFocus={(e) => that.focusPhone(e)}
                                               value={modularType == 2 ? userName : account.phone}
                                               type="tel" maxLength="11" max='99999'
                                               placeholder="请输入电话号码"
                                               disabled={modularType == 2 ? true : false}/>
                                        <div className="msg msg_f">
                                            <i>-</i>
                                            <em></em>
                                        </div>
                                    </li>
                                    <li>
                                        <span>图形验证码&nbsp;:&nbsp;</span>
                                        <input type="tel" placeholder="" maxLength="4"
                                               onChange={(e) => that.changeBarCode(e)}
                                               onFocus={(e) => that.focusBarCode(e)}
                                               value={account.barCode}/>
                                        <img src={'data:image/png;base64,' + imgData}
                                             onClick={(e) => that.imgInvisibilityClick(e)}/>
                                        <em className="changeOne" onClick={(e) => that.InvisibilityClick(e)}>换一张</em>
                                        <div className="msg msg_t">
                                            <i>-</i>
                                            <em></em>
                                        </div>
                                    </li>
                                    <li>
                                        <p onClick={(e) => that.accountNextStep(e)}>下一步</p>
                                    </li>
                                </ul>
                            </li> : null
                        }
                        {modularShow == 2 ?
                            <li>
                                <ul className="verification">
                                    <li>
                                        <span>手机号码&nbsp;:&nbsp;</span>
                                        <em>{modularType == 2 ? userName : account.phone}</em>
                                    </li>
                                    <li>
                                        <span>短信验证码&nbsp;:&nbsp;</span>
                                        <input type="tel" placeholder="" onChange={(e) => that.changeVerification(e)}
                                               onFocus={(e) => that.focusVerification(e)}
                                        />
                                        <div className="verificationCode" onClick={(e) => that.obtainClck(e)}>获取验证码
                                        </div>
                                        <div className="verificationMask"></div>
                                        <div className="msg msg_th">
                                            <i>-</i>
                                            <em></em>
                                        </div>
                                    </li>
                                    <li>
                                        <p onClick={(e) => that.authenticateNextStep(e)}>下一步</p>
                                    </li>
                                </ul>
                            </li> : null
                        }
                        {modularShow == 3 ?
                            <li>
                                <ul className="reset">
                                    <li>
                                        <span className="adopt">验证通过&nbsp;,&nbsp;你可以设置新的密码了!</span>
                                    </li>
                                    <li>
                                        <span>新密码&nbsp;:&nbsp;</span>
                                        <input type="password" placeholder="请输入新密码"
                                               onChange={(e) => that.newPassword(e)}
                                               onFocus={(e) => that.focusNewPassword(e)}
                                        />
                                        <div className="msg msg_fo">
                                            <i>-</i>
                                            <em></em>
                                        </div>
                                    </li>
                                    <li>
                                        <span>确认密码&nbsp;:&nbsp;</span>
                                        <input type="password" placeholder="请确认新密码"
                                               onChange={(e) => that.confirmNewPassword(e)}
                                               onFocus={(e) => that.focusConfirmNewPassword(e)}/>
                                        <div className="msg msg_fi">
                                            <i>-</i>
                                            <em></em>
                                        </div>
                                    </li>
                                    <li>
                                        <p onClick={(e) => that.passwordVerification(e)}>下一步</p>
                                    </li>
                                </ul>
                            </li> : null
                        }
                        {modularShow == 4 ?
                            <li>
                                <div className="success">
                                    <div className="success-item">
                                        <img src={require('../images/success.png')}/>
                                        <em>恭喜你&nbsp;,&nbsp;密码重置成功&nbsp;,&nbsp;请牢记新的密码</em>
                                    </div>
                                    <p onClick={(e) => that.goShopping(e)}>去购物</p>
                                </div>
                            </li> : null
                        }
                    </ul>
                </div>

                {/*footer*/}
                <FooterNav/>
            </div>
        )
    }

}

export {PasswordBack}

