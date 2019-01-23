/*
 * 注册模块
 * */

import React, {Component} from 'react';

import {FormHeader} from '../commonviews/form-header';
import {Loading} from '../commonviews/loading';
import {PopWinodw} from '../commonviews/popup-window';
import {Agreement} from '../commonviews/agreement';

//引入js
import {encription, parseQueryString} from '../util/query';
import {ApiPost, getTimeStamp} from '../config/api';
import {checkmobile} from '../util/util';
import {provinceList} from '../lib/area';
import md5 from 'md5';

//引入css
import '../styles/common.css';
import '../styles/register.css';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            _agreement: true, //注册协议状态
            loading: false, //数据提交状态
            registerLine: 0,  //注册步骤 0 填写注册信息  1 填写店铺信息
            submitError: false, //提交错误
            submitTip: '',  //提交信息错误
            userMsg: '',    //电话号码
            userMsgDelete: false,  //删除电话号码状态
            userTip: '', //电话号码错误信息
            userError: false,  //电话号码错误
            identify: '',  //验证码
            identifyDelete: false,  //删除验证码状态
            identifyFailure: false, //验证码获取状态
            identifyTip: '',//错误提示信息
            identifyError: false, //验证码错误
            password: '',  //密码
            passwordDelete: false,  //删除密码状态
            passwordTip: '',  //密码错误信息
            passwordError: false, //密码错
            aggrementTip: true,  //已选择
            storeRegister: 1, //店铺注册方式  1.实体店 2.线上店
            storeName: '', //店铺名称
            storeNameTip: '', //店铺名称错误提示
            storeNameError: false, //状态
            storeUser: '', //店主名字
            storeUserTip: '',
            storeUserError: false,
            storeBusiness: '', //经营类目
            storeBusinessTip: '',
            storeBusinessError: false,
            storeAdTip: '',
            storeAdError: false,
            storeAdDetail: '', //详细地址
            storeAdDetailTip: '',
            storeAdDetailError: false,
            referees: '',  //推荐人
            storeImgTip: '', //照片上传错误信息
            storeImgError: false,
            businessLicense: '',  //营业执照
            businessDelete: false, //是否删除显现
            businessLoad: false, //正在加载中
            storeImage: '', //店铺正面照
            storeImageDelete: false,
            storeImageLoad: false,
            storeSystem: '',  //店铺后台
            storeSystemDelete: false,
            storeSystemLoad: false,
            userCardFront: '',  //店主身份证正面
            userCardFrontDelete: false,
            userCardFrontLoad: false,
            userCardBack: '',   //店主身份证反面
            userCardBackDelete: false,
            userCardBackLoad: false,
            province: [
                {id: -1, regionName: '请选择'},
            ], //省
            _province: '', //选择省
            city: [
                {id: -1, regionName: '请选择'},
            ], //市
            cityId: null, //city id
            _city: '', //选择市
            town: [
                {id: -1, regionName: '请选择'},
            ],  //区
            _town: '',  //选择县镇
            storeSubmitTip: '', //提交错误信息
            storeSubmitError: false,
            warningTip: {
                title: '',
                leftBtn: '',
                rightBtn: '',
                btnShow: false,
            }, //警告标题
            warningShow: false, //警告弹窗状态
            successShow: false, //注册成功状态
            timers: 3, //倒计时
            successTip: {
                title: '注册成功',
                close: true,
                leftBtn: '',
                rightBtn: '',
                success: true,
                btnShow: false,
                knowTitle: '去登录(3s)',
            }
        };

        //事件绑定
        this.changeAgr = this.changeAgr.bind(this);
        this.changeIdentify = this.changeIdentify.bind(this);
        this.getIndentify = this.getIndentify.bind(this);
        this.changePassWord = this.changePassWord.bind(this);
        this.deleteValue = this.deleteValue.bind(this);
        this.deleteError = this.deleteError.bind(this);
        this.submitMsg = this.submitMsg.bind(this);
        this.changeStore = this.changeStore.bind(this);
        this.changeStoreName = this.changeStoreName.bind(this);
        this.changeStoreUser = this.changeStoreUser.bind(this);
        this.changeBusiness = this.changeBusiness.bind(this);
        this.changeArea = this.changeArea.bind(this);
        this.changeCity = this.changeCity.bind(this);
        this.changeTown = this.changeTown.bind(this);
        this.changeAdDetail = this.changeAdDetail.bind(this);
        this.changeReferees = this.changeReferees.bind(this);
        this.submit = this.submit.bind(this);
        this.selectBusinessImage = this.selectBusinessImage.bind(this);
        this.selectStoreImage = this.selectStoreImage.bind(this);
        this.selectSystemImage = this.selectSystemImage.bind(this);
        this.selectFrontImage = this.selectFrontImage.bind(this);
        this.selectBackImage = this.selectBackImage.bind(this);
        this.cancel = this.cancel.bind(this);
        this.agreeAgr = this.agreeAgr.bind(this);
        this.cancelAgr = this.cancelAgr.bind(this);
        this.goLogin = this.goLogin.bind(this);

    }

    componentDidMount() {
        //url参数
        this.query = parseQueryString(window.location.href);
        //初始化省
        let province = [{id: -1, regionName: '请选择'}];
        provinceList.map((item, index) => {
            province.push({id: item.id, regionName: item.regionName, region: item.region});
        });
        this.setState({province: province});
    }

    //注册协议
    agreeAgr(e) {
        e.stopPropagation();
        this.setState({
            _agreement: false,
        })
    }

    cancelAgr(e) {
        e.stopPropagation();
        if (this.query.ReturnUrl) {
            window.location.href = unescape(this.query.url);

        }
        else {
            window.location.href = '/';
        }
    }

    //关闭警告弹窗
    cancel() {
        this.setState({
            warningShow: false,
        })
    }

    //输入电话号码
    changeUser(e) {
        let VALUE = e.currentTarget.value;
        if (VALUE.trim().length > 11) {
            return false;
        }
        this.setState({
            userMsg: VALUE,
            userMsgDelete: VALUE.length > 0 ? true : false,
        });
    }

    //输入验证码
    changeIdentify(e) {
        let VALUE = e.currentTarget.value;
        this.setState({
            identify: VALUE,
            identifyDelete: VALUE.length > 0 ? true : false,
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
                userError: true,
                userTip: '请输入电话号码',
            });
            return false;
        }
        if (!checkmobile(userMsg)) {
            this.setState({
                userError: true,
                userTip: '手机号码格式不对',
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
                }
                else {
                    console.log(data.msg);
                }
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

    //输入密码
    changePassWord(e) {
        let VALUE = e.currentTarget.value;
        this.setState({
            password: VALUE,
            passwordDelete: VALUE.length > 0 ? true : false,
        });
    }

    //删除input数据
    deleteValue(e, index) {
        //阻止事件冒泡
        e.stopPropagation();
        if (index == 0) {
            this.setState({userMsg: '', userMsgDelete: false});
            this.userInput.focus();
        }
        else if (index == 1) {
            this.setState({identify: '', identifyDelete: false});
            this.indentifyInput.focus();
        }
        else if (index == 2) {
            this.setState({password: '', passwordDelete: false});
            this.passwordInput.focus();
        }
    }

    //改变协议
    changeAgr() {
        let {aggrementTip} = this.state;
        this.setState({
            aggrementTip: !aggrementTip
        }, () => {
            if (this.state.aggrementTip) {
                this.setState({
                    submitError: false,
                    submitTip: '请勾选服务协议',
                });
            }
        });
    }

    //输入聚焦删除所有错误提示
    deleteError() {
        this.setState({
            userTip: '',
            userError: false,
            identifyTip: '',
            identifyError: false,
            passwordTip: '',
            passwordError: false,
            submitError: false,
            submitTip: '',
        })
    }

    //提交注册信息
    submitMsg() {
        let {userMsg, identify, password, aggrementTip} = this.state;

        //校正电话号码
        if (userMsg == '') {
            this.setState({
                userError: true,
                userTip: '请填写手机号码',
            });
            return false;
        }
        else {
            if (!checkmobile(userMsg)) {
                this.setState({
                    userError: true,
                    userTip: '手机号码格式不对',
                });
                return false;
            }
            else {
                this.setState({
                    userError: false,
                    userTip: '',
                });
            }
        }
        //校正验证码
        if (identify == '') {
            this.setState({
                identifyError: true,
                identifyTip: '请填写验证码',
            });
            return false;

        }
        else {
            this.setState({
                identifyError: false,
                identifyTip: '',
            });
        }
        //校正密码
        if (password == '') {
            this.setState({
                passwordError: true,
                passwordTip: '请填写密码',
            });
            return false;
        }
        else {
            if (password.length > 18 || password.length < 6) {
                this.setState({
                    passwordError: true,
                    passwordTip: '设置的密码不符合要求',
                });
                return false;
            }
            else {
                this.setState({
                    passwordError: false,
                    passwordTip: '',
                });
            }
        }
        //是否勾选用户协议
        if (!aggrementTip) {
            this.setState({
                submitError: true,
                submitTip: '请勾选服务协议',
            });
            return false;
        }

        let data = {
            phoneCode: userMsg,
            password: md5(password),
            identifyingcode: identify,
            timeStamp: getTimeStamp(),
        };
        let params = {
            url: '/mobile-web-user/ws/mobile/v1/user/preRegister?sign=' + encription(data),
            params: data,
        };
        ApiPost(params)
            .then((data) => {
                if (data.code == 1) {
                    this.setState({
                        registerLine: 1,
                    });
                }
                else {
                    this.setState({
                        submitError: true,
                        submitTip: data.msg,
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    /***店铺信息 ***/
    //更换注册线上线下店
    changeStore(e, index) {
        e.stopPropagation();
        this.setState({storeRegister: index})
    }

    //店铺名称
    changeStoreName(e) {
        let VALUE = e.currentTarget.value;
        this.setState({
            storeName: VALUE,
            storeNameError: false,
            storeNameTip: '',
        });
    }

    //店主名称
    changeStoreUser(e) {
        let VALUE = e.currentTarget.value;
        this.setState({
            storeUser: VALUE,
            storeUserError: false,
            storeUserTip: '',
        });
    }

    //选择经营类目
    changeBusiness(e) {
        let element = e.currentTarget;
        let index = element.selectedIndex;
        let VALUE = element.options[index].text;
        this.setState({
            storeBusiness: VALUE,
            storeBusinessError: false,
            storeBusinessTip: '',
        });
    }

    //选择地址
    changeArea(e) {
        let {province} = this.state;
        let element = e.currentTarget;
        let index = element.selectedIndex;
        let id = element.options[index].value;
        let VALUE = element.options[index].text;
        this.setState({
            storeAdError: false,
            storeAdTip: '',
        });
        if (id == -1) {
            let city = [{id: -1, regionName: '请选择'}];
            let town = [{id: -1, regionName: '请选择'}];
            this.setState({
                _province: '',
                city: city,
                _city: '',
                cityId: null,
                town: town,
            })
        }
        else {
            let city = [{id: -1, regionName: '请选择'}];
            let town = [{id: -1, regionName: '请选择'}];
            province[index].region.map((item, index) => {
                city.push({id: item.id, regionName: item.regionName, region: item.region});
            });
            this.setState({
                _province: VALUE,
                city: city,
                _city: '',
                cityId: null,
                town: town,
            }, () => {
                document.getElementById('city').value = '-1';
            })
        }
    }

    //选择城镇
    changeCity(e) {
        let {city} = this.state;
        let element = e.currentTarget;
        let index = element.selectedIndex;
        let id = element.options[index].value;
        let VALUE = element.options[index].text;
        this.setState({
            storeAdError: false,
            storeAdTip: '',
        });
        if (id == -1) {
            let town = [{id: -1, regionName: '请选择'}];
            this.setState({
                _city: '',
                cityId: null,
                town: town,
            })
        }
        else {
            let town = [{id: -1, regionName: '请选择'}];
            if(city[index].region){
                city[index].region.map((item, index) => {
                    town.push({id: item.id, regionName: item.regionName});
                });
            }
            this.setState({
                _city: VALUE,
                cityId: id,
                town: town,
            }, () => {
                console.log(town);
                if(town.length == 1){
                    document.getElementById('town').style.display = 'none';
                }
                else {
                    document.getElementById('town').style.display = 'inline-block';
                }
                document.getElementById('town').value = '-1';
            })
        }
    }

    //选择县镇
    changeTown(e) {
        let element = e.currentTarget;
        let index = element.selectedIndex;
        let VALUE = element.options[index].text;
        this.setState({
            storeAdError: false,
            storeAdTip: '',
        });
        this.setState({
            _town: VALUE,
        })
    }

    //选择详细地址
    changeAdDetail(e) {
        let VALUE = e.currentTarget.value;
        this.setState({
            storeAdDetail: VALUE,
            storeAdDetailError: false,
            storeAdDetailTip: '',
        });
    }

    //输入推荐人
    changeReferees(e) {
        let VALUE = e.currentTarget.value;
        this.setState({referees: VALUE});
    }

    //上传图片
    selectBusinessImage(e) {
        let element = e.currentTarget;
        if (!element.files || !element.files[0]) {
            return false;
        }
        if ((element.files[0].size / 1024) > 1024 * 3) {
            this.setState({
                storeImgError: true,
                storeImgTip: '上传图片大小不能超过2M',
            });
            return false;
        }
        this.setState({
            storeImgError: false,
            storeImgTip: '',
        });
        let that = this;
        this.setState({businessLoad: true});
        let reader = new FileReader();
        reader.readAsDataURL(element.files[0]);
        reader.onload = (evt) => {
            that.imgPost(evt.target.result.split(',')[1], (imgUrl) => {
                that.setState({
                    businessLicense: imgUrl,
                    businessLoad: false,
                }, () => element.value = '') //清空value，可以重新上传同一张图片
            })
        };
    }

    selectStoreImage(e) {
        let element = e.currentTarget;
        if (!element.files || !element.files[0]) {
            return false;
        }
        if ((element.files[0].size / 1024) > 1024 * 3) {
            this.setState({
                storeImgError: true,
                storeImgTip: '上传图片大小不能超过2M',
            });
            return false;
        }
        this.setState({
            storeImgError: false,
            storeImgTip: '',
        });
        let that = this;
        this.setState({storeImageLoad: true});
        let reader = new FileReader();
        reader.readAsDataURL(element.files[0]);
        reader.onload = (evt) => {
            that.imgPost(evt.target.result.split(',')[1], (imgUrl) => {
                that.setState({
                    storeImage: imgUrl,
                    storeImageLoad: false,
                }, () => element.value = '') //清空value，可以重新上传同一张图片
            })
        };
    }

    selectSystemImage(e) {
        let element = e.currentTarget;
        if (!element.files || !element.files[0]) {
            return false;
        }
        if ((element.files[0].size / 1024) > 1024 * 3) {
            this.setState({
                storeImgError: true,
                storeImgTip: '上传图片大小不能超过2M',
            });
            return false;
        }
        this.setState({
            storeImgError: false,
            storeImgTip: '',
        });
        let that = this;
        this.setState({storeSystemLoad: true});
        let reader = new FileReader();
        reader.readAsDataURL(element.files[0]);
        reader.onload = (evt) => {
            that.imgPost(evt.target.result.split(',')[1], (imgUrl) => {
                that.setState({
                    storeSystem: imgUrl,
                    storeSystemLoad: false,
                }, () => element.value = '') //清空value，可以重新上传同一张图片
            })
        };
    }

    selectFrontImage(e) {
        let element = e.currentTarget;
        if (!element.files || !element.files[0]) {
            return false;
        }
        if ((element.files[0].size / 1024) > 1024 * 3) {
            this.setState({
                storeImgError: true,
                storeImgTip: '上传图片大小不能超过2M',
            });
            return false;
        }
        this.setState({
            storeImgError: false,
            storeImgTip: '',
        });
        let that = this;
        this.setState({userCardFrontLoad: true});
        let reader = new FileReader();
        reader.readAsDataURL(element.files[0]);
        reader.onload = (evt) => {
            that.imgPost(evt.target.result.split(',')[1], (imgUrl) => {
                that.setState({
                    userCardFront: imgUrl,
                    userCardFrontLoad: false,
                }, () => element.value = '') //清空value，可以重新上传同一张图片
            })
        };
    }

    selectBackImage(e) {
        let element = e.currentTarget;
        if (!element.files || !element.files[0]) {
            return false;
        }
        if ((element.files[0].size / 1024) > 1024 * 3) {
            this.setState({
                storeImgError: true,
                storeImgTip: '上传图片大小不能超过2M',
            });
            return false;
        }
        this.setState({
            storeImgError: false,
            storeImgTip: '',
        });
        let that = this;
        this.setState({userCardBackLoad: true});
        let reader = new FileReader();
        reader.readAsDataURL(element.files[0]);
        reader.onload = (evt) => {
            that.imgPost(evt.target.result.split(',')[1], (imgUrl) => {
                that.setState({
                    userCardBack: imgUrl,
                    userCardBackLoad: false,
                }, () => element.value = '') //清空value，可以重新上传同一张图片
            })
        };
    }

    //图片请求
    imgPost(imgData, callback) {
        let data = {
            userId: 0,
            flag: 2,
            fileType: 'jpeg',
            base64data: imgData,
        };

        let param = {
            url: '/mobile-web-user/ws/mobile/v1/user/imgUpload',
            method: 'post',
            params: data,
        };

        ApiPost(param)
            .then((data) => {
                if (data.code == 1) {
                    callback(data.response.uploadurl);
                }
                else {
                    console.log(data.msg);
                }
            })
            .catch((error) => {
                console.log(error);
            });

    }

    //提交注册
    submit(e) {
        e.stopPropagation();
        let that = this;
        let {userMsg, identify, password, storeName, storeUser, storeBusiness, _province, _city, cityId, _town, storeAdError, storeAdTip, storeAdDetail, storeRegister, businessLicense, storeImage, storeSystem, userCardFront, userCardBack, referees} = this.state;
        if (storeName == '') {
            this.setState({
                storeNameError: true,
                storeNameTip: '请输入店铺名称',
            });
            return false;
        }
        if (storeUser == '') {
            this.setState({
                storeUserError: true,
                storeUserTip: '请输入店主名称',
            });
            return false;
        }
        if (storeBusiness == '' || storeBusiness == '请选择经营类目') {
            this.setState({
                storeBusinessError: true,
                storeBusinessTip: '请输入经营类目',
            });
            return false;
        }
        if (_province == '' || _city == '') {
            this.setState({
                storeAdError: true,
                storeAdTip: '请选择地址',
            });
            return false;
        }
        if(document.getElementById('town').style.display == 'initial'){
            if(_town == ''){
                this.setState({
                    storeAdError: true,
                    storeAdTip: '请选择地址',
                });
                return false;
            }
        }
        if (storeAdDetail == '') {
            this.setState({
                storeAdDetailError: true,
                storeAdDetailTip: '请输入详细地址',
            });
            return false;
        }
        //店铺注册
        if (storeRegister == 1) {
            if (businessLicense == '') {
                this.setState({
                    storeImgError: true,
                    storeImgTip: '请上传营业执照',
                });
                return false;
            }
            else if (storeImage == '') {
                this.setState({
                    storeImgError: true,
                    storeImgTip: '请上传店铺正面照',
                });
                return false;
            }
        }
        else if (storeRegister == 2) {
            if (storeSystem == '') {
                this.setState({
                    storeImgError: true,
                    storeImgTip: '请上传店铺后台照',
                });

                return false;
            }
            else if (userCardFront == '') {
                this.setState({
                    storeImgError: true,
                    storeImgTip: '请上传身份证正面照',
                });
                return false;
            }
            else if (userCardBack == '') {
                this.setState({
                    storeImgError: true,
                    storeImgTip: '请上传身份证反面照',
                });
                return false;
            }
        }
        this.setState({loading: true});
        let data = {
            phoneCode: userMsg, //手机号
            password: md5(password), //密码
            origin: 2, //用户来源 1:web;2:pc;3:android;4:ios;5:wp
            identifyingcode: identify,//验证码
            storeName: storeName,//店铺名称
            ownerName: storeUser,//店主姓名
            businessCatagory: storeBusiness, //经营类目
            province: _province, //省
            city: _city, //市
            area: _town, //区
            address: storeAdDetail, //详细地址
            cityId: cityId, //市id
            licenseUrl: storeRegister == 1 ? businessLicense : '', //营业执照（线下店铺要求）
            storeFrontUrl: storeRegister == 1 ? storeImage : '', //门店正面照（线下店铺要求）
            storeBackendUrl: storeRegister == 2 ? storeSystem : '', //店铺后台照片（线上店铺要求）
            cardFrontUrl: storeRegister == 2 ? userCardFront : '', //身份证正面图片路径（线上店铺要求）
            cardBackUrl: storeRegister == 2 ? userCardBack : '', //身份证背面图片路径（线上店铺要求）
            referrer: referees, //推荐人
            storeType: storeRegister //店铺类型（1，实体店铺 2，线上店铺）
        };
        let params = {
            url: '/mobile-web-user/ws/mobile/v1/user/register?sign=' + encription(data),
            params: data,
        };
        ApiPost(params)
            .then((data) => {
                this.setState({loading: false});
                if (data.code == 1) {
                    this.setState({
                        successShow: true,
                    }, () => {
                        //倒计时登录
                        that.timeSet();
                    })
                }
                else {
                    this.setState({
                        warningShow: true,
                        warningTip: {
                            title: data.msg,
                            leftBtn: '',
                            rightBtn: '',
                            btnShow: false,
                        },
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    warningShow: true,
                    warningTip: '服务器连接超时，请重试!'
                });
            })
    }

    //倒计时进行跳转到登录页面
    timeSet() {
        let that = this;
        let {timers} = this.state;
        this.timerLogin = setInterval(() => {
            if (timers == 3) {
                this.setState({
                    successTip: {
                        title: '注册成功',
                        close: true,
                        leftBtn: '',
                        rightBtn: '',
                        success: true,
                        btnShow: false,
                        knowTitle: '去登录(2s)',
                    }
                })
            }
            else if (timers == 2) {
                this.setState({
                    successTip: {
                        title: '注册成功',
                        close: true,
                        leftBtn: '',
                        rightBtn: '',
                        success: true,
                        btnShow: false,
                        knowTitle: '去登录(1s)',
                    }
                })
            }
            else if (timers == 1) {
                this.setState({
                    successTip: {
                        title: '注册成功',
                        close: true,
                        leftBtn: '',
                        rightBtn: '',
                        success: true,
                        btnShow: false,
                        knowTitle: '去登录(0s)',
                    }
                }, () => {
                    clearInterval(that.timerLogin);
                    window.location.href = 'login.html?url=' + escape(this.query.url);
                    return false;
                })
            }
            that.setState({
                timers: timers--,
            }, () => {
                console.log(1);
            });
        }, 1000);
    }

    //去登录
    goLogin(e) {
        e.stopPropagation();
        window.location.href = 'login.html?url=' + escape(this.query.url);
    }

    componentWillUnmount() {

    }

    render() {

        const {_agreement, registerLine, submitTip, submitError, userMsg, userMsgDelete, userTip, userError, identify, identifyDelete, identifyTip, identifyError, identifyFailure, password, passwordDelete, passwordTip, passwordError, aggrementTip, storeRegister, storeName, storeNameTip, storeNameError, storeUser, storeUserTip, storeUserError, storeBusinessTip, storeBusinessError, storeAdTip, storeAdError, province, city, town, storeAdDetail, storeAdDetailTip, storeAdDetailError, referees, storeImgTip, storeImgError, storeSubmitTip, storeSubmitError, businessLicense, businessDelete, businessLoad, storeImage, storeImageDelete, storeImageLoad, storeSystem, storeSystemDelete, storeSystemLoad, userCardFront, userCardFrontDelete, userCardFrontLoad, userCardBack, userCardBackDelete, userCardBackLoad, loading, warningTip, warningShow, successShow, successTip} = this.state;

        return (
            <div className="page">

                {/*header*/}
                <FormHeader title={'欢迎注册'}/>

                {/*注册表格*/}
                <div className="register-form">
                    {/*注册信息*/}
                    {
                        registerLine == 0 ?
                            <div className="form-msg">

                                <div className={`form-item user-phone${userError ? ' active' : ''}`}>
                                    <label>手机号码</label>
                                    <input ref={(input) => this.userInput = input} type="text"
                                           placeholder="请输入手机号码"
                                           className="itxt text"
                                           maxLength={14}
                                           onChange={(e) => this.changeUser(e)} value={userMsg}
                                           onFocus={this.deleteError}/>
                                    <span className="clear-btn"
                                          style={userMsgDelete ? {display: 'block'} : {display: 'none'}}
                                          onClick={(e) => this.deleteValue(e, 0)}>
                            </span>
                                    <div className="input-tip">
                                <span className="error"
                                      style={userError ? {display: 'block'} : {display: 'none'}}><i></i>{userTip}</span>
                                    </div>
                                </div>

                                <div className="form-item user-identify">
                                    <label>短信验证码</label>
                                    <input ref={(input) => this.indentifyInput = input} type="text"
                                           placeholder="请输入验证码"
                                           className="itxt text"
                                           onChange={(e) => this.changeIdentify(e)} value={identify}
                                           onFocus={this.deleteError}/>
                                    <span className="clear-btn iden-tip"
                                          style={identifyDelete ? {display: 'block'} : {display: 'none'}}
                                          onClick={(e) => this.deleteValue(e, 1)}>
                            </span>
                                    <a href="javascript: void (0)"
                                       className={`get-identify${identifyFailure ? ' disabled' : ''}`}
                                       onClick={(e) => this.getIndentify(e)}>获取验证码</a>
                                    <div className="input-tip">
                                <span className="error"
                                      style={identifyError ? {display: 'block'} : {display: 'none'}}><i></i>{identifyTip}</span>
                                    </div>
                                </div>

                                <div className="form-item user-password">
                                    <label>设置密码</label>
                                    <input ref={(input) => this.passwordInput = input} type="passWord"
                                           placeholder="请设置6-18密码"
                                           className="itxt text"
                                           maxLength={18}
                                           onChange={(e) => this.changePassWord(e)} value={password}
                                           onFocus={this.deleteError}/>
                                    <span className="clear-btn"
                                          style={passwordDelete ? {display: 'block'} : {display: 'none'}}
                                          onClick={(e) => this.deleteValue(e, 2)}>
                            </span>
                                    <div className="input-tip">
                                <span className="error" style={passwordError ? {display: 'block'} : {display: 'none'}}>
                                    <i></i>{passwordTip}</span>
                                    </div>
                                </div>

                                <div className="register-agreement">
                                    <div className="error-tip">
                                        <em className="error"
                                            style={submitError ? {display: 'block'} : {display: 'none'}}>
                                            <i></i>
                                            {submitTip}
                                        </em>
                                    </div>
                                    <span onClick={this.changeAgr}>
                                <i className={ aggrementTip ? 'active' : '' }>
                                </i>
                                同意《会员乐虎供应链用户服务协议》
                            </span>
                                </div>

                                <a href="javascript: void (0)" className="submit-msg"
                                   onClick={this.submitMsg}>提交并填写注册信息</a>

                            </div>
                            : null
                    }
                    {/*店铺注册信息*/}
                    {
                        registerLine == 1 ?
                            <div className="store-register">

                                <div className="tabs">
                                    <div className="store-register-tabs fixed">
                                                <span className="register-tab">
                                                    <a href="javascript: void (0)"
                                                       className={`tab-l${storeRegister == 1 ? ' active' : ''}`}
                                                       onClick={(e) => this.changeStore(e, 1)}>实体店用户注册</a>
                                                </span>
                                        <span className="register-tab">
                                                    <a href="javascript: void (0)"
                                                       className={storeRegister == 2 ? 'active' : ''}
                                                       onClick={(e) => this.changeStore(e, 2)}>线上店用户注册</a>
                                                </span>
                                    </div>
                                </div>

                                <div className="store-register-content">

                                    <div className="form-item user-phone">
                                        <label>店 铺 名 称</label>
                                        <input type="text" placeholder="店铺名称"
                                               maxLength={30}
                                               className={`itxt text${storeNameError ? ' active' : ''}`}
                                               onChange={(e) => this.changeStoreName(e)} value={storeName}/>
                                        <div className="input-tip">
                                            <span className="error"
                                                  style={storeNameError ? {display: 'block'} : {display: 'none'}}><i></i>{storeNameTip}</span>
                                        </div>
                                    </div>

                                    <div className="form-item user-name">
                                        <label>店 主 姓 名</label>
                                        <input type="text" placeholder="店主姓名"
                                               maxLength={20}
                                               className={`itxt text${storeUserError ? ' active' : ''}`}
                                               onChange={(e) => this.changeStoreUser(e)} value={storeUser}/>
                                        <div className="input-tip">
                                            <span className="error"
                                                  style={storeUserError ? {display: 'block'} : {display: 'none'}}><i></i>{storeUserTip}</span>
                                        </div>
                                    </div>

                                    <div className="form-item user-business">
                                        <label>经 营 类 目</label>
                                        <select className={`bus-select${storeBusinessError ? ' active' : '' }`}
                                                onChange={(e) => this.changeBusiness(e)}>
                                            <option value="-1">请选择经营类目</option>
                                            <option value="0">食品</option>
                                            <option value="1">母婴</option>
                                            <option value="2">美容护肤</option>
                                            <option value="3">综合类</option>
                                            <option value="4">其他</option>
                                        </select>
                                        <div className="input-tip">
                                            <span className="error"
                                                  style={storeBusinessError ? {display: 'block'} : {display: 'none'}}><i></i>{storeBusinessTip}</span>
                                        </div>
                                    </div>

                                    <div className="form-item user-address">
                                        <label>店 铺 地 址</label>
                                        <div className="address-list">
                                            <select id="province" className="address-item"
                                                    onChange={(e) => this.changeArea(e)}>
                                                {
                                                    province.map((item, index) => {
                                                        return (<option value={item.id}
                                                                        key={index}>{item.regionName}</option>)
                                                    })
                                                }
                                            </select>
                                            <select id="city" className="address-item"
                                                    onChange={(e) => this.changeCity(e)}>
                                                {
                                                    city.map((item, index) => {
                                                        return (<option value={item.id}
                                                                        key={index}>{item.regionName}</option>)
                                                    })
                                                }
                                            </select>
                                            <select id="town" className="address-item"
                                                    onChange={(e) => this.changeTown(e)}>
                                                {
                                                    town.map((item, index) => {
                                                        return (<option value={item.id}
                                                                        key={index}>{item.regionName}</option>)
                                                    })
                                                }
                                            </select>
                                        </div>

                                        <div className="input-tip">
                                            <span className="error"
                                                  style={storeAdError ? {display: 'block'} : {display: 'none'} }><i></i>{storeAdTip}</span>
                                        </div>
                                    </div>

                                    <div className="form-item user-addressDetail">
                                        <label>详 细 地 址</label>
                                        <input type="text" placeholder="详细地址"
                                               maxLength={100}
                                               className={`itxt text${storeAdDetailError ? ' active' : ''}`}
                                               value={storeAdDetail} onChange={(e) => this.changeAdDetail(e)}/>
                                        <div className="input-tip">
                                            <span className="error"
                                                  style={storeAdDetailError ? {display: 'block'} : {display: 'none'}}><i></i>{storeAdDetailTip}</span>
                                        </div>
                                    </div>

                                    <div className="form-item user-referees">
                                        <label>推&nbsp;&nbsp;&nbsp;荐&nbsp;&nbsp;&nbsp;人</label>
                                        <input type="text" className="itxt text" value={referees}
                                               onChange={(e) => this.changeReferees(e)}/>
                                    </div>

                                    <div className="form-item user-images">
                                        <label>店 铺 照 片</label>
                                        <div className="store-images fixed">
                                            {/*营业执照*/}
                                            <div className="btn-upload" onMouseMove={() => {
                                                businessLicense != '' ? this.setState({businessDelete: true}) : null
                                            } } style={storeRegister == 1 ? {display: 'block'} : {display: 'none'} }>
                                                <div className="btn-upload-img">
                                                    <img
                                                        src={ businessLicense != '' ? businessLicense : require('../images/login/sign-in_icon_camer.png')}
                                                        id="business"/>
                                                    <input type="file" className="upload"
                                                           accept="image/jpeg"
                                                           onChange={ (e) => this.selectBusinessImage(e)}/>
                                                </div>

                                                <div className="m-img-show"
                                                     style={businessDelete || businessLoad ? {display: 'block'} : {display: 'none'}}
                                                     onMouseOut={() => {
                                                         businessLicense != '' ? this.setState({businessDelete: false}) : null
                                                     }}>
                                                    {
                                                        businessDelete ? <div className="delete"
                                                                              onClick={() => businessLicense != '' ? this.setState({
                                                                                  businessLicense: '',
                                                                                  businessDelete: false
                                                                              }) : null }></div> : null
                                                    }
                                                    {
                                                        businessLoad ? <i className="uploading">上传中</i> : null
                                                    }
                                                </div>
                                                <span className="upload-title">营业执照</span>
                                            </div>
                                            {/*门店正面照片*/}
                                            <div className="btn-upload" onMouseMove={() => {
                                                storeImage != '' ? this.setState({storeImageDelete: true}) : null
                                            } } style={storeRegister == 1 ? {display: 'block'} : {display: 'none'} }>
                                                <div className="btn-upload-img">
                                                    <img
                                                        src={storeImage != '' ? storeImage : require('../images/login/sign-in_icon_camer.png')}
                                                        id="storeImage"/>
                                                    <input type="file" className="upload" accept="image/jpeg"
                                                           onChange={ (e) => this.selectStoreImage(e)}/>
                                                </div>
                                                <div className="m-img-show"
                                                     style={storeImageLoad || storeImageDelete ? {display: 'block'} : {display: 'none'}}
                                                     onMouseOut={() => {
                                                         storeImage != '' ? this.setState({storeImageDelete: false}) : null
                                                     }}>
                                                    {
                                                        storeImage ? <div className="delete"
                                                                          onClick={() => storeImage != '' ? this.setState({
                                                                              storeImage: '',
                                                                              storeImageDelete: false
                                                                          }) : null }></div> : null
                                                    }
                                                    {
                                                        storeImageLoad ? <i className="uploading">上传中</i> : null
                                                    }
                                                </div>
                                                <span className="upload-title">门店正面照</span>
                                            </div>
                                            {/*店铺后台*/}
                                            <div className="btn-upload" onMouseMove={() => {
                                                storeSystem != '' ? this.setState({storeSystemDelete: true}) : null
                                            }} style={storeRegister == 2 ? {display: 'block'} : {display: 'none'} }>
                                                <div className="btn-upload-img">
                                                    <img
                                                        src={ storeSystem != '' ? storeSystem : require('../images/login/sign-in_icon_camer.png')}
                                                        id="storeSystem"/>
                                                    <input type="file" className="upload"
                                                           accept="image/jpeg,image/gif,image/png,image/bmp"
                                                           onChange={ (e) => this.selectSystemImage(e)}/>
                                                </div>
                                                <div className="m-img-show"
                                                     style={storeSystemLoad || storeSystemDelete ? {display: 'block'} : {display: 'none'}}
                                                     onMouseOut={() => {
                                                         storeSystem != '' ? this.setState({storeSystemDelete: false}) : null
                                                     }}>
                                                    {
                                                        storeSystem ? <div className="delete"
                                                                           onClick={() => storeSystem != '' ? this.setState({
                                                                               storeSystem: '',
                                                                               storeSystemDelete: false
                                                                           }) : null }></div> : null
                                                    }
                                                    {
                                                        storeSystemLoad ? <i className="uploading">上传中</i> : null
                                                    }
                                                </div>
                                                <span className="upload-title">店铺后台照</span>
                                            </div>
                                            {/*店主身份证正面照*/}
                                            <div className="btn-upload" onMouseMove={() => {
                                                userCardFront != '' ? this.setState({userCardFrontDelete: true}) : null
                                            }} style={storeRegister == 2 ? {display: 'block'} : {display: 'none'} }>
                                                <div className="btn-upload-img">
                                                    <img
                                                        src={userCardFront != '' ? userCardFront : require('../images/login/sign-in_icon_camer.png')}
                                                        id="business"/>
                                                    <input type="file" className="upload"
                                                           accept="image/jpeg,image/gif,image/png,image/bmp"
                                                           onChange={ (e) => this.selectFrontImage(e)}/>
                                                </div>
                                                <div className="m-img-show"
                                                     style={userCardFrontLoad || userCardFrontDelete ? {display: 'block'} : {display: 'none'}}
                                                     onMouseOut={() => {
                                                         userCardFront != '' ? this.setState({userCardFrontDelete: false}) : null
                                                     }}>
                                                    {
                                                        userCardFront ? <div className="delete"
                                                                             onClick={() => userCardFront != '' ? this.setState({
                                                                                 userCardFront: '',
                                                                                 userCardFrontDelete: false
                                                                             }) : null }></div> : null
                                                    }
                                                    {
                                                        userCardFrontLoad ? <i className="uploading">上传中</i> : null
                                                    }
                                                </div>
                                                <span className="upload-title">身份证正面照</span>
                                            </div>
                                            {/*身份证反面照*/}
                                            <div className="btn-upload" onMouseMove={() => {
                                                userCardBack != '' ? this.setState({userCardBackDelete: true}) : null
                                            }} style={storeRegister == 2 ? {display: 'block'} : {display: 'none'} }>
                                                <div className="btn-upload-img">
                                                    <img
                                                        src={ userCardBack != '' ? userCardBack : require('../images/login/sign-in_icon_camer.png')}
                                                        id="business"/>
                                                    <input type="file" className="upload"
                                                           accept="image/jpeg,image/gif,image/png,image/bmp"
                                                           onChange={ (e) => this.selectBackImage(e)}/>
                                                </div>
                                                <div className="m-img-show"
                                                     style={userCardBackLoad || userCardBackDelete ? {display: 'block'} : {display: 'none'}}
                                                     onMouseOut={() => {
                                                         userCardBack != '' ? this.setState({userCardBackDelete: false}) : null
                                                     }}>
                                                    {
                                                        userCardBack ? <div className="delete"
                                                                            onClick={() => userCardBack != '' ? this.setState({
                                                                                userCardBack: '',
                                                                                userCardBackDelete: false
                                                                            }) : null }></div> : null
                                                    }
                                                    {
                                                        userCardBackLoad ? <i className="uploading">上传中</i> : null
                                                    }
                                                </div>
                                                <span className="upload-title">身份证反面照</span>
                                            </div>
                                        </div>
                                        <div className="input-tip">
                                            <span className="error"
                                                  style={storeImgError ? {display: 'block'} : {display: 'none'}}><i></i>{storeImgTip}</span>
                                        </div>
                                    </div>

                                    <div className="submit-store">
                                        <div className="submit-tip">
                                            <span className="error"
                                                  style={storeSubmitError ? {display: 'block'} : {display: 'none'}}><i></i>{storeSubmitTip}</span>
                                        </div>
                                        <a href="javascript: void (0)" onClick={(e) => this.submit(e)}>提交注册</a>
                                    </div>

                                </div>


                            </div>
                            : null
                    }
                    {/*数据加载中*/}
                    {
                        loading ? <Loading/> : null
                    }
                    {/*阴影层*/}
                    {
                        warningShow || _agreement || successShow ?
                            <div className="cover-body"></div>
                            : null
                    }
                    {/*警告提示窗*/}
                    {
                        warningShow ?
                            <PopWinodw popup={warningTip} cancel={(e) => this.cancel(e)}
                                       custom={(e) => this.cancel(e)}/>
                            : null
                    }
                    {/*注册协议*/}
                    {
                        _agreement ?
                            <Agreement agreeAgr={(e) => this.agreeAgr(e)} cancel={(e) => this.cancelAgr(e)}/>
                            : null
                    }
                    {/*注册成功*/}
                    {
                        successShow ?
                            <PopWinodw popup={successTip} custom={(e) => this.goLogin(e)}/>
                            : null
                    }
                </div>


            </div>
        )

    }

}

export {Register}