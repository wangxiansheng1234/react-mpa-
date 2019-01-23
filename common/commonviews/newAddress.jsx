/*
 * 新增地址弹窗
 * */

import React, {Component} from 'react';


//引入css
import '../styles/common/newAddress.css';

import {ApiPost} from "../config/api";
import {getUser} from '../util/store';
import {encription} from "../util/query";
import {checkmobile} from '../util/util';

import {provinceList} from '../lib/area';

class NewAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: {
                addressId: '',
                name: '',
                phone: '',
                province: '',
                city: '',
                area: '',
                address: '',
                cityId: '',
                idCardNumber: '',
                cardFrontImg: '',
                cardBackImg: '',
                enable: '',
            },
            special: false,//特殊情况处理
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
        }

        //获取user
        this.user = getUser();

        //事件绑定
        this.changeArea = this.changeArea.bind(this);
        this.changeCity = this.changeCity.bind(this);
        this.changeTown = this.changeTown.bind(this);
        this.changeName = this.changeName.bind(this);
        this.blurPhone = this.blurPhone.bind(this);
        this.changePhone = this.changePhone.bind(this);
        this.changeAdDetail = this.changeAdDetail.bind(this);
        this.changeAreaAdress = this.changeAreaAdress.bind(this);
        this.selectFrontImage = this.selectFrontImage.bind(this);
        this.selectBackImage = this.selectBackImage.bind(this);
        this.changeIdentity = this.changeIdentity.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        let that = this;
        if (that.props.magType) {
            //初始化省
            let province = [{id: -1, regionName: '请选择'}];
            provinceList.map((item, index) => {
                province.push({id: item.id, regionName: item.regionName, region: item.region});
            });
            that.setState({province: province});
        } else {
            that.setState({
                address: {
                    addressId: that.props.modify.m_addressId,
                    name: that.props.modify.m_name,
                    phone: that.props.modify.m_phone,
                    province: that.props.modify.m_province,
                    city: that.props.modify.m_city,
                    cityId: that.props.modify.m_cityId,
                    area: that.props.modify.m_area,
                    address: that.props.modify.m_address,
                    idCardNumber: that.props.modify.m_idCardNumber,
                    cardFrontImg: that.props.modify.m_cardFrontImg,
                    cardBackImg: that.props.modify.m_cardBackImg,
                    enable: that.props.modify.m_enable,
                },
            }, () => {
                console.log("hha" + JSON.stringify(that.state.address));
            });
        }
    }

    componentWillUnmount() {

    }

    changeAreaAdress(...arg) {
        let that = this;
        //初始化省
        provinceList.map((item, index) => {
            if (arg[0] == item.regionName) {
                that.setState({
                    _province: arg[0],
                    _city: arg[1],
                    _town: arg[2],
                    province: provinceList,
                    city: provinceList[index].region,
                });
                if (provinceList[index].region) {
                    let cityList = provinceList[index].region;
                    cityList.map((item, index) => {
                        this.setState({cityId: item.id});
                        if (arg[1] == item.regionName) {
                            if (item.region == undefined) {
                                that.setState({
                                    special: true,
                                })
                            } else {
                                that.setState({
                                    special: false,
                                    town: item.region
                                })
                            }

                        }
                    })
                }
            }
        })
    }

    //改变姓名
    changeName(event) {
        let {address} = this.state;
        let Name = event.currentTarget.value;
        address.name = Name;
        document.querySelector('.Consignee').style.border = '1px solid #DDDDDD';
        this.setState({address});
    }

    //改变电话号码
    changePhone(event) {
        let {address} = this.state;
        let Phone = event.currentTarget.value;
        document.querySelector('.phone').style.border = '1px solid #DDDDDD';
        address.phone = Phone;
        this.setState({address});
    }

    //添加手机号
    blurPhone(event) {
        let Phone = event.currentTarget.value;
        if (!checkmobile(Phone)) {
            console.log('手机号码必须是以1开头的11位数字')
        }
    }

    //选择地址
    changeArea(e) {
        let {province, address} = this.state;
        let element = e.currentTarget;
        let index = element.selectedIndex;
        let id = element.options[index].value;
        let VALUE = element.options[index].text;
        document.querySelector('.province').style.border = '1px solid #ddd';
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
        } else {
            let city = [{id: -1, regionName: '请选择'}];
            let town = [{id: -1, regionName: '请选择'}];

            province[index].region.map((item, index) => {
                city.push({id: item.id, regionName: item.regionName, region: item.region});
            });
            this.state.address.province = VALUE;
            this.state.address.city = '';
            this.state.address.area = '';
            this.setState({
                _province: VALUE,
                city: city,
                town: town,
                address,
            }, () => {
                console.log("123" + JSON.stringify(address));
            })
        }
    }

    //选择城镇
    changeCity(e) {
        let {city, address} = this.state;
        let element = e.currentTarget;
        let index = element.selectedIndex;
        let id = element.options[index].value;
        let VALUE = element.options[index].text;
        console.log("id" + id);
        document.querySelector('.city').style.border = '1px solid #ddd';
        if (id == -1) {
            let town = [{id: -1, regionName: '请选择'}];
            this.setState({
                _city: '',
                cityId: null,
                town: town,
            })
        } else {
            let town = [{id: -1, regionName: '请选择'}];

            if (city[index].region == undefined) {
                this.setState({
                    special: true,
                })
            } else {
                this.setState({
                    special: false,
                });
                city[index].region.map((item, index) => {
                    town.push({id: item.id, regionName: item.regionName});
                });
            }
            this.state.address.city = VALUE;
            this.state.address.cityId = id;
            this.state.address.area = '';
            this.setState({
                _city: VALUE,
                cityId: id,
                town: town,
                address,
            }, () => {
                console.log("456" + JSON.stringify(address));
            })
        }
    }

    //选择县镇
    changeTown(e) {
        let {town, address} = this.state;
        let element = e.currentTarget;
        let index = element.selectedIndex;
        let VALUE = element.options[index].text;
        this.state.address.area = VALUE;
        document.querySelector('.town').style.border = '1px solid #ddd';
        this.setState({
            _town: VALUE,
            address,
        })
    }

    //改变详细地址
    changeAdDetail(e) {
        let {address} = this.state;
        let AdDetail = e.currentTarget.value;
        address.address = AdDetail;
        document.querySelector('.in-detailed').style.border = '1px solid #dddddd';
        this.setState({address});
    }

    //改变身份证
    changeIdentity(e) {
        let {address} = this.state;
        let idCardNumber = e.currentTarget.value;
        address.idCardNumber = idCardNumber;
        document.querySelector('.idNumber').style.border = '1px solid #ddd';
        this.setState({address});
    }

    //上传正面图片
    selectFrontImage(event) {
        const {address} = this.state;
        let that = this;
        let element = event.currentTarget;
        document.querySelector('.positive').style.border = 'none';
        if (!element.files || !element.files[0]) {
            return false;
        }
        let reader = new FileReader();
        reader.readAsDataURL(element.files[0]);
        reader.onload = (evt) => {
            let data = {
                userId: that.user.userId,
                strUserId: that.user.userId,
                strToken: that.user.token,
                flag: 2,
                fileType: 'jpeg',
                base64data: evt.target.result.split(',')[1],
            };
            let param = {
                url: '/mobile-web-user/ws/mobile/v1/user/imgUpload?sign=' + encription(data),
                method: 'post',
                params: data,
            };
            ApiPost(param)
                .then((data) => {
                    if (data.code == 1) {
                        address.cardFrontImg = data.response.uploadurl;
                        this.setState({address});
                        document.getElementById('front').src = evt.target.result;
                    }
                })
                .catch((error) => {
                    console.log('服务器错误');
                })
        };
    }

    //上传反面图片
    selectBackImage(event) {
        const {address} = this.state;
        let that = this;
        let element = event.currentTarget;
        document.querySelector('.negative').style.border = 'none';
        if (!element.files || !element.files[0]) {
            return false;
        }
        let reader = new FileReader();
        reader.readAsDataURL(element.files[0]);
        reader.onload = (evt) => {

            let data = {
                userId: that.user.userId,
                strUserId: that.user.userId,
                strToken: that.user.token,
                flag: 2,
                fileType: 'jpeg',
                base64data: evt.target.result.split(',')[1],
            };
            let param = {
                url: '/mobile-web-user/ws/mobile/v1/user/imgUpload?sign=' + encription(data),
                method: 'post',
                params: data,
            };
            ApiPost(param)
                .then((data) => {
                    if (data.code == 1) {
                        address.cardBackImg = data.response.uploadurl;
                        this.setState({address});
                        document.getElementById('back').src = evt.target.result;
                    } else {
                        /*  Tip(data.msg);*/
                    }
                })
                .catch((error) => {
                    console.log('服务器错误');
                });
        };
    }

    //保存并使用
    save() {
        let that = this;
        const {address, special} = this.state;
        const {magType} = this.props;

        //判断用户是否输入各个数据是否都OK
        if (address.name.replace(/\s/g, "") == '') {

            document.querySelector('.Consignee').style.border = '1px solid #ED3A4A';
            return false
        }


        if (address.province == '') {

            document.querySelector('.province').style.border = '1px solid #ED3A4A';
            return false
        }
        if (address.city == '') {

            document.querySelector('.city').style.border = '1px solid #ED3A4A';
            return false
        }
        if (!special) {
            if (address.area == '') {
                document.querySelector('.town').style.border = '1px solid #ED3A4A';
                return false
            }
        }

        if (address.address.replace(/\s/g, "") == '') {

            document.querySelector('.in-detailed').style.border = '1px solid #ED3A4A';
            return false
        }

        if (address.phone.replace(/\s/g, "") == '') {

            document.querySelector('.phone').style.border = '1px solid #ED3A4A';
            return false
        }

        if (!checkmobile(address.phone)) {

            document.querySelector('.phone').style.border = '1px solid #ED3A4A';
            return false
        }

        if (address.idCardNumber.replace(/\s/g, "") != '') {

            if (address.idCardNumber.replace(/\s/g, "") != '' && !address.idCardNumber.match(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/g)) {
                document.querySelector('.idNumber').style.border = '1px solid #ED3A4A';
                return false;
            }

            if (address.cardFrontImg == '') {

                document.querySelector('.positive').style.border = '1px solid #ED3A4A';
                return false;
            }
            if (address.cardBackImg == '') {

                document.querySelector('.negative').style.border = '1px solid #ED3A4A';
                return false;
            }
        }

        if (address.cardFrontImg != '' || address.cardBackImg != '') {
            if (address.idCardNumber.replace(/\s/g, "") == '') {
                document.querySelector('.idNumber').style.border = '1px solid #ED3A4A';
                return false;
            }

            if (address.idCardNumber.replace(/\s/g, "") != '' && !address.idCardNumber.match(/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/g)) {
                document.querySelector('.idNumber').style.border = '1px solid #ED3A4A';
                return false;
            }

        }

        let data = {
            id: address.addressId != '' ? address.addressId : '',
            userId: that.user.userId,   //用户id 必须
            strUserId: that.user.userId,
            strToken: that.user.token,
            name: address.name,    //收货人姓名
            phone: address.phone,
            province: address.province,
            city: address.city,
            cityId: address.cityId,
            area: address.area,
            address: address.address,
            idCardNumber: address.idCardNumber,
            cardFrontImg: address.cardFrontImg,   //正面照
            cardBackImg: address.cardBackImg,     //反面照
            enable: address.enable,
        };
        let param = {
            url: '/mobile-web-user/ws/mobile/v1/address/' + (magType ? 'add' : 'modify') + '?sign=' + encription(data),
            method: 'post',
            params: data,
        };
        ApiPost(param)
            .then((data) => {
                if (data.code == 1) {

                    this.props.btnarea();

                } else if (data.code == 10) {

                    console.log(data.msg);
                    setTimeout(() => {
                    }, 1000)
                } else {

                    console.log(data.msg)
                }
            })
            .catch((error) => {
                console.log('服务器错误!');
            })
    }

    render() {
        let that = this;
        const {province, city, town, address, _province, _city, _town, special} = this.state;
        const {magType} = this.props;
        return (
            <div className="eject">
                <div className="e-title">
                    <h2>{magType ? "增加新地址" : "修改地址"} </h2>
                    <img onClick={that.props.cancal}
                         src={require('../images/personal/icon_shop_del-.png')}/>
                </div>
                <ul className="edit">
                    <li>
                        <span><i>*</i>收货人&nbsp;:&nbsp;</span>
                        <input type="tel" id="Consignee" className="Consignee" placeholder="收货人姓名" maxLength="10"
                               name="username" value={address.name} onChange={(e) => that.changeName(e)}/>
                    </li>
                    <li data-cityid={address.cityId == '' ? 0 : address.cityId}>
                        <span><i>*</i>收货地址&nbsp;:&nbsp;</span>
                        <select className="province" onChange={(e) => this.changeArea(e)}>
                            {
                                province.map((item, index) => {
                                    return (
                                        <option selected={_province == item.regionName ? true : false} value={item.id}
                                                key={index}>{item.regionName}</option>
                                    )
                                })
                            }
                        </select>
                        <select className="city" onChange={(e) => this.changeCity(e)}>
                            {
                                city.map((item, index) => {
                                    return (
                                        <option selected={_city == item.regionName ? true : false} value={item.id}
                                                key={index}>{item.regionName}</option>)
                                })
                            }
                        </select>
                        {
                            !special ? <select className="town" onChange={(e) => this.changeTown(e)}>
                                {
                                    town.map((item, index) => {
                                        return (
                                            <option selected={_town == item.regionName ? true : false} value={item.id}
                                                    key={index}>{item.regionName}</option>)
                                    })
                                }
                            </select> : null
                        }

                    </li>
                    <li>
                        <span><i>*</i>详细地址&nbsp;:&nbsp;</span>
                        <input id="" className="in-detailed" type="tel" placeholder="详细地址" maxLength="100"
                               onChange={(e) => that.changeAdDetail(e)} value={address.address}/>
                    </li>
                    <li>
                        <span><i>*</i>手机号码&nbsp;:&nbsp;</span>
                        <input className="phone" type="tel" name="username" maxLength="11" placeholder="收货人手机号码"
                               value={address.phone}
                               onChange={(e) => that.changePhone(e)}
                               onBlur={(e) => that.blurPhone(e)}/>
                    </li>
                    <li>
                        <span>身份证号&nbsp;:&nbsp;</span>
                        <input className="idNumber" type="tel" name="idNumber" maxLength="18" placeholder="收货人身份证号"
                               value={address.idCardNumber} onChange={(e) => that.changeIdentity(e)}/>
                    </li>
                    {/*身份证图片*/}
                    <li><span>身份证照&nbsp;:&nbsp;</span>
                        <div className="picBox">
                            <p className="item-photo positive">
                                <img
                                    src={address.cardFrontImg != '' ? address.cardFrontImg : require('../images/id_front.png')}
                                    id="front"/>
                                <input accept="image/*" className="upload" type="file"
                                       onChange={(e) => that.selectFrontImage(e)}/>
                            </p>
                            <p className="item-photo negative">
                                <img
                                    src={address.cardBackImg != '' ? address.cardBackImg : require('../images/id_back.png')}
                                    id="back"/>
                                <input accept="image/*" className="upload" type="file"
                                       onChange={(e) => that.selectBackImage(e)}/>
                            </p>
                        </div>
                    </li>
                    <li>
                        <a href="javascript:void(0);" className="preservation" onClick={(e) => that.save(e)}>保存</a>
                        <a href="javascript:void(0);" onClick={that.props.cancal}>取消</a>
                    </li>
                </ul>
            </div>
        )
    }
}

export {NewAddress}
