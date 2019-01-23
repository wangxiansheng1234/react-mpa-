
/*
* 商品详情
* */


import React, {Component} from 'react';

import '../styles/common.css';
import '../styles/goodsDetails.css';

import {HeaderTop} from '../commonviews/header-top';
import {SearchHeader} from '../commonviews/search-header';
import {FooterNav} from '../commonviews/footer';
import {CopyRight} from '../commonviews/copyRight';
import {ToolBar} from '../commonviews/tool-bar';
import {Loading} from '../commonviews/loading';
import {Mask} from '../commonviews/mask';
import {NewAddress} from '../commonviews/newAddress';
import {PopWinodw} from '../commonviews/popup-window';


import {ApiPost, ApiGet, getTimeStamp} from '../config/api';
import {encription} from "../util/query";
import {getUser} from '../util/store';

class GoodsDetails extends Component{
    constructor(props){
        super(props);

        this.increaseNum = this.increaseNum.bind(this);
        this.decreaseNum = this.decreaseNum.bind(this);
        this.buyGoods = this.buyGoods.bind(this);
        this.add2Cart = this.add2Cart.bind(this);
        this.selectSpec = this.selectSpec.bind(this);

        this.state = {
            goodsInfo:'',
            specData:'',
            sumNum:1,
            province:0,
            city:0,
            district:0,
            range:1,
            category:[],
            categoryArr:[],
            suggestGoods:[],
            categoryIdArr: [],
            categoryHrefArr: [],
            goodsItemId: -1,
            hotWords:[],
            addressDialog:false,
            modify: {             //修改之前参数
                m_addressId: '',
                m_name: '',
                m_province: '',
                m_city: '',
                m_area: '',
                m_address: '',
                m_phone: '',
            },
            showError: false,
            showConfirm: false,
            popup:{
              close: false,
              success: false,
                knowTitle:'',
                title:''
            },
            specArr:[],//规格数组
            mainPic: '',
            allValidSpecArr:[]
        };

        this.user = getUser();

        //栏目信息
        this.categoryArr = [];
        //栏目id信息
        this.categoryIdArr = [];
        //栏目跳转路径
        this.categoryHrefArr = [];

        this.cancel = this.cancel.bind(this);
        this.addAddressSuccess = this.addAddressSuccess.bind(this);
        this.goToCart = this.goToCart.bind(this);
    }

    componentWillMount() {
        let sumNum = 0;
        if(!this.props.initData.goods.goodsInfo.goodsQty){
            sumNum = this.props.initData.goods.goodsInfo.goodsQty
        }else{
            if(this.props.initData.goods.goodsInfo.goodsQty < this.props.initData.goods.goodsInfo.goodsStartNum){
                sumNum = 0;
            }else{
                sumNum = this.props.initData.goods.goodsInfo.goodsStartNum
            }
        }
        this.setState({
            goodsInfo: this.props.initData.goods,
            category: this.props.initData.goods.category,
            specData: this.props.spec,
            goodsStartNum:this.props.initData.goods.goodsInfo.goodsStartNum,
            goodsVipPrice:this.props.initData.goods.goodsInfo.goodsVipPrice,
            goodsPrice:this.props.initData.goods.goodsInfo.goodsPrice,
            goodsStatus:this.props.initData.goods.goodsInfo.goodsStatus,
            goodsMultipleNum:this.props.initData.goods.goodsInfo.goodsMultipleNum,
            goodsQty:this.props.initData.goods.goodsInfo.goodsQty,
            sumNum:sumNum,
            hotWords:this.props.hot,
            address:'',
            logoutDialog: false
        })

    }

    ImageText(goodsId) {
        let that = this;
        let data = {
            goodsId: goodsId,
        };

        let param = {
            url: "/mobile-web-trade/ws/mobile/v1/goods/goodsDetail",
            params: data
        };
        ApiPost(param)
            .then((res) => {
                $('.details-wrap').append(res.response.goodsDetail.goodsDesc)
            })
            .catch((error) => {
            })
    }

    componentDidMount() {
        let that = this;
        this.ImageText(this.props.initData.goods.goodsInfo.goodsId);
        this.resetFixedTab();
        this.hoverImg();
        this.initAddress();
        this.initCategory();
        this.requestSuggestGoods();
        this.setState({
            goodsItemId: this.props.initData.goods.goodsInfo.goodsItemId
        },function () {
            that.findSpecDueToItemId();
        });

        this.URL = window.location.protocol + '//'+ window.location.host;

        if(this.user){
            this.requestAddressId();
        }
    }

    requestAddressId(callBack){
        let that = this;
        that.user = getUser();
        let data = {
            areaId:0,
            cityId:0,
            goodsItemId:that.props.initData.goods.goodsInfo.goodsItemId,
            strToken:that.user.token,
            strUserId:that.user.userId,
            timeStamp:that.timeStamp,
            userId:that.user.userId
        };
        //详情
        let params = {
            url: '/mobile-web-trade/ws/mobile/v1/goods/goodsInfo?sign=' + encription(data),
            method: 'post',
            params: data,
        };
        ApiPost(params)
            .then((res) => {
                if(res.code == 1){
                    that.setState({
                        addressId: res.response.goods.addressFreight.addressId,
                        address: res.response.goods.addressFreight.address
                    },function () {
                        if(callBack instanceof Function){
                            callBack();
                        }
                    });
                }else{

                }
            })
            .catch((error) => {
            })
    }

    initCategory(){
        let URL = window.location.protocol + '//'+ window.location.host;
        this.categoryArr[0] = this.state.category[0].catName;
        this.categoryIdArr[0] = this.state.category[0].catId;
        this.categoryHrefArr[0] = URL + '/goodsList.html?mark=2&first=' + this.categoryIdArr[0];

        this.categoryArr[1] = this.state.category[0].category && this.state.category[0].category[0].catName ? this.state.category[0].category[0].catName : '';
        this.categoryIdArr[1] = this.state.category[0].category && this.state.category[0].category[0].catId ? this.state.category[0].category[0].catId : '';
        this.categoryHrefArr[1] = URL + '/goodsList.html?mark=2&first=' + this.categoryIdArr[0] + '&second=' + this.categoryIdArr[1];

        this.categoryArr[2] = this.state.category[0].category[0].category && this.state.category[0].category[0].category[0].catName ? this.state.category[0].category[0].category[0].catName : '';
        this.categoryIdArr[2] = this.state.category[0].category[0].category && this.state.category[0].category[0].category[0].catId ? this.state.category[0].category[0].category[0].catId : '';
        this.categoryHrefArr[2] = URL + '/goodsList.html?mark=2&first=' + this.categoryIdArr[0] + '&second=' + this.categoryIdArr[1] + '&third=' + this.categoryIdArr[2];

        this.setState({
            categoryArr: this.categoryArr,
            categoryIdArr: this.categoryIdArr,
            categoryHrefArr: this.categoryHrefArr,
        })
    }

    //详情吸顶效果
    resetFixedTab(){
        let topDis = $('.switch-tab-content').offset().top;
        $(window).scroll(function () {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if(scrollTop >= topDis){
                $('.nav-tabs').css('position','fixed');
                $('.nav-tabs').css('top','0');
            }else if(scrollTop < topDis){
                $('.nav-tabs').css('position','relative');
            }
        })
    }

    hoverImg(){
        $('.img-list li').hover(function () {
            $('.img-list li').removeClass('active');
            $(this).addClass('active');
            let url = $(this).find('img').attr('src');
            $('.major-img img').attr('src',url);
        });
    }

    //选择地址
    initAddress(){
        let that = this;
        $('.first-area li').delegate('a','click', function () {
            that.setState({
                province: $(this).attr('data-value')
            });
        });

        $('.second-area li').delegate('a','click', function () {
            that.setState({
                city: $(this).attr('data-value')
            });
        });

        $('.third-area li').delegate('a','click', function () {
            that.setState({
                district: $(this).attr('data-value')
            });
            that.getRange();
        });
    }

    requestSuggestGoods(){
        let that = this;
        let data = {
            mark: 99,
            source: 0
        };

        let param = {
            url: "/mobile-web-search/ws/mobile/v1/search/list",
            params: data
        };
        ApiPost(param)
            .then((res) => {
                if(res.code == 1){
                    that.setState({
                        suggestGoods:res.response.goodsListVO.list.splice(0,5)
                    })
                }else{

                }
            })
            .catch((error) => {
            })
    }

    //查询运费
    getRange(){
        let that = this;
        let data = {
            storeId: that.state.goodsInfo.goodsInfo.storeId,
            cityId: that.state.city
        };

        let param = {
            url: "/mobile-web-trade/ws/mobile/v1/goods/getRange?sign=" + encription(data),
            params: data
        };
        ApiPost(param)
            .then((res) => {
                if(res.code == 1){
                    that.setState({
                        range:res.response.range
                    })
                }else{
                    that.setState({
                        range:0
                    })
                }
            })
            .catch((error) => {
            })
    }

    componentWillUnmount() {

    }

    //重置输入的数字
    getValidNum(num){
        let that = this;
        if(num <= 0){
            num = that.state.goodsStartNum;
            return num;
        }
        if(num > that.state.goodsQty){
            num = that.state.goodsQty;
            return num;
        }
        let j = (num - that.state.goodsStartNum)%that.state.goodsMultipleNum;
        if(j !== 0){
            num += j;
        }
        if(num > that.state.goodsQty){
            num = that.state.goodsQty
        }else if(num < that.state.goodsStartNum){
            num = that.state.goodsStartNum
        }

        return num;
    }

    textChange(e){
        let that = this;
        let elm = e.currentTarget;
        let value = $(elm).val();
        let reg = /^[0-9]+.?[0-9]*$/;
        if(value.indexOf('.')>=0){
            value = Math.round(value);
            value = that.getValidNum(value);
        }
        if(isNaN(value)){
            value = that.state.goodsStartNum
        }
        if (!reg.test(value)) {
            value = that.state.goodsStartNum
        }
        if(value < that.state.goodsStartNum){
            value = that.state.goodsStartNum
        }
        if(value > that.state.goodsQty){
            value = that.state.goodsQty
        }
        let left = (value - that.state.goodsStartNum)%that.state.goodsMultipleNum;
        if(left != 0 ){
            value = value - left;
        }

        if(value <= that.state.goodsStartNum && !$('.decrease').hasClass('disabled')){
            $('.decrease').addClass('disabled');
        }else if(value > that.state.goodsStartNum && $('.decrease').hasClass('disabled')){
            $('.decrease').removeClass('disabled')
        }

        if(value >= that.state.goodsQty && !$('.increase').hasClass('disabled')){
            $('.increase').addClass('disabled')
        }else if(value <= (that.state.goodsQty - that.state.goodsMultipleNum) && $('.increase').hasClass('disabled')){
            $('.increase').removeClass('disabled')
        }

        that.setState({
            sumNum:value
        });

    }

    //减号
    decreaseNum(e){
        let that = this;
        let elm = e.currentTarget;
        let value = Number($('.input-sum').val());
        if($(elm).hasClass('disabled')){
            return;
        }

        that.setState({
            sumNum: value - that.state.goodsMultipleNum
        })
    }

    //加号
    increaseNum(e){
        let that = this;
        let elm = e.currentTarget;
        let value = Number($('.input-sum').val());
        if($(elm).hasClass('disabled')){
            return;
        }
        that.setState({
            sumNum: value + that.state.goodsMultipleNum
        })
    }

    //选择规格
    selectSpec(index, specDetailId, e){
        let that = this;
        let elem = e.currentTarget;
        if($(elem).hasClass('spec-disable')){
            return;
        }
        let specArr = that.state.specArr;
        //点击时筛选出合法的排列组合。
        // let temp = that.filterValidSpecArr(index, specDetailId);
        //判断之前specArr里面的规格是否被包含在。如果被包含，保持高亮。不被包含，设为空
        // let tempArr = that.restChoosenSpec(temp, specArr);
        let tempArr = [];
        that.state.specArr.map((item, index)=>{
            tempArr[index] = item;
        });

        tempArr[index] = specDetailId;
        let key = tempArr.join(',');
        let goodsItem = that.state.specData.itemData[key];
        if(!goodsItem){
            return;
        }
        that.setState({
            goodsItemId: goodsItem ? goodsItem.goodsItemId : -1,
            goodsVipPrice:goodsItem ? goodsItem.goodsVipPrice : that.state.goodsVipPrice,
            goodsPrice:goodsItem ? goodsItem.goodsPrice : that.state.goodsPrice,
            goodsQty:goodsItem ? goodsItem.goodsItemStock : that.state.goodsQty,
            mainPic:goodsItem ? goodsItem.goodsItemImg : '',
            specArr: goodsItem? tempArr : that.state.specArr,
            sumNum: goodsItem && that.state.goodsQty >= goodsItem.goodsStartNum ? goodsItem.goodsStartNum : 0,
            goodsStartNum:goodsItem ? goodsItem.goodsStartNum : that.state.goodsStartNum,
            goodsMultipleNum:goodsItem ? goodsItem.goodsMultipleNum : that.state.goodsMultipleNum,

        })
    }

    //添加地址成功的回调
    addAddressSuccess(){
        let that = this;
        that.setState({
            addressDialog: false
        })
        let callBack = function () {
            that.buyNowRequest();
        };
        that.requestAddressId(callBack);
    }

    //立即购买
    buyGoods(){
        if($('.buy').hasClass('buy-disable')){
            return;
        }
        this.user = getUser();
        let that = this;
        if(!that.user){
            let Url = window.location.href;
            Url = escape(Url);
            window.location.href = that.URL + '/login.html?url=' + Url;
            return;
        }

        if(!that.state.addressId){
            that.setState({addressDialog:true});
        }else{
            that.buyNowRequest();
        }
    }

    buyNowRequest(){
        let that = this;
        let quantity = $('.input-sum').val();
        that.user = getUser();
        that.setState({
            isLoading: true
        });
        let data = {
            userId: that.user.userId,
            strToken: that.user.token,
            strUserId: that.user.userId,
            goodsId: that.props.initData.goods.goodsInfo.goodsId,
            storeId: that.state.goodsInfo.goodsInfo.storeId,
            goodsItemId: that.state.goodsItemId,
            goodsSource: that.props.initData.goods.goodsInfo.goodsSource,
            quantity: quantity,
            timeStamp: that.timeStamp,
            addressId: that.state.addressId,
        };

        let params = {
            url: '/mobile-web-trade/ws/mobile/v1/cal/buyNow?sign=' + encription(data),
            method: 'post',
            params: data,
        };

        ApiPost(params)
            .then((res) => {
                that.setState({
                    isLoading: false
                })
                if(res.code == 1){
                    window.location.href = that.URL + '/shopping/order.html' + '?from=0&goodsItemId=' + that.state.goodsItemId + '&storeId=' + that.state.goodsInfo.goodsInfo.storeId + '&goodsSource=' + that.props.initData.goods.goodsInfo.goodsSource + '&quantity=' + quantity + '&pagesrc=' + window.location.href;
                }else if(res.code == -10){
                    that.setState({
                        logoutDialog: true,
                        popup1:{
                            close: true,
                            success: false,
                            btnShow: true,
                            leftBtn:'去登录',
                            rightBtn:'继续浏览',
                            title:'登录状态已失效！'
                        }
                    })
                }else{
                    that.setState({
                        showError: true,
                        popup:{
                            close: true,
                            success: false,
                            knowTitle:'关闭',
                            title:res.msg
                        }
                    })
                }
            })
            .catch((error) => {
                that.setState({
                    showError: true,
                    isLoading:false,
                    popup:{
                        close: true,
                        success: false,
                        knowTitle:'关闭',
                        title:'服务器错误'
                    }
                })
            })
    }

    //添加到购物车
    add2Cart(){
        if($('.add2cart').hasClass('add2cart-disable')){
            return;
        }
        this.user = getUser();
        let that = this;

        if(!this.user){
            let Url = window.location.href;
            Url = escape(Url);
            window.location.href = that.URL + '/login.html?url=' + Url;
        }
        that.setState({
            isLoading: true
        })
        let data = {
            goodsId: that.props.initData.goods.goodsInfo.goodsId,
            goodsItemId: that.state.goodsItemId,
            quantity: $('.input-sum').val(),
            storeId: that.state.goodsInfo.goodsInfo.storeId,
            strToken: this.user.token,
            strUserId: this.user.userId,
            userId: this.user.userId,
            timeStamp: this.timeStamp
        };

        let param = {
            url: "/mobile-web-trade/ws/mobile/v1/cart/add?sign=" + encription(data),
            params: data
        };
        ApiPost(param)
            .then((res) => {
                that.setState({
                    isLoading: false
                })
                if(res.code == 1){
                    that.setState({
                        showConfirm: true
                    })
                }else if(res.code == -10){
                    that.setState({
                        logoutDialog: true,
                        popup1:{
                            close: true,
                            success: false,
                            btnShow: true,
                            leftBtn:'去登录',
                            rightBtn:'继续浏览',
                            title:'登录状态已失效！'
                        }
                    })
                }else{
                    that.setState({
                        showError: true,
                        popup:{
                            close: true,
                            success: false,
                            knowTitle:'关闭',
                            title:res.msg
                        }
                    })
                }
            })
            .catch((error) => {
                that.setState({
                    isLoading: false,
                    showError: true,
                    popup:{
                        close: true,
                        success: false,
                        knowTitle:'关闭',
                        title:'服务器错误'
                    }
                })
            })
    }

    cancel(){
        this.setState({
            addressDialog: false,
            showError: false,
            showConfirm:false
        })
    }

    goToCart(){
        window.location.href = this.URL + '/cart.action';
    }

    //遍历json 寻找key
    findSpecDueToItemId(){
        let that = this;
        let itemData = that.state.specData.itemData;
        let spec = '';
        let specArr = [];
        if(that.state.goodsItemId <= 0){
            return;
        }
        let allValidSpecArr = [];
        let temp = [];
        for(let item in itemData){
            if(itemData[item].goodsItemStock > 0){
                temp.push(item);
            }
            if(itemData[item].goodsItemId === that.state.goodsItemId){
                spec = item;
            }
        }
        if(temp.length > 0 ){
            temp.map(function (valid, index) {
                let arr = valid.split(',');
                allValidSpecArr.push(arr);
            })
        }
        if(spec){
            specArr = spec.split(',');
        }
        that.setState({
            specArr: specArr,
            allValidSpecArr: allValidSpecArr,
            temp: allValidSpecArr
        });
    }

    isInArray(arr,value){
        if(arr.length === 0){
            return false;
        }
        for(let i = 0; i < arr.length; i++){
            if(value == Number(arr[i])){
                return true;
            }
        }
        return false;
    }

    isValid(temp, specId, index){
        if(!temp || !temp.length){
            if(this.state.allValidSpecArr && this.state.allValidSpecArr.length){
                temp = this.state.allValidSpecArr;
            }
            return true;
        }
        let result = false;
        for(let i = 0; i < temp.length; i++){
            if(temp[i][index] == specId){
                result = true;
                break;
            }
        }

        return result;
    }

    changeImg(e){
        let element = e.currentTarget;
        element.src = require('../images/def-goods.jpg');
    }

    goLogin(){
        let that = this;
        this.setState({
            logoutDialog: false
        })
        let Url = window.location.href;
        Url = escape(Url);
        window.location.href = that.URL + '/login.html?url=' + Url;
    }

    stayHere(){
        this.setState({
            logoutDialog: false
        })
        window.location.reload();
    }
    
    render(){
        const that = this;
        const imgs = that.state.goodsInfo.goodsInfo.goodsImg.split(',', 5);
        const goodsInfo = that.state.goodsInfo.goodsInfo;
        const promotionInfo = that.state.goodsInfo.promotionInfo;
        const specList = that.state.specData.specList;
        let URL = that.URL || '';
        let goodsQty = that.state.goodsQty;
        let popup = {
            close: false,
            success: true,
            knowTitle:'去购物车',
            title:'成功加入购物车'
        };
        let specArr = that.state.specArr;
        return(

            <div className="container">

                {
                    that.state.isLoading ? <Loading/> : null
                }

                {/*顶部*/}
                <HeaderTop/>

                {/*搜索*/}
                <SearchHeader hotWords={that.state.hotWords} category={[]} navi={[]} hide={true} navHide={false}/>

                {
                    that.state.addressDialog ? <NewAddress magType={true} modify={that.state.modify} cancal={this.cancel} btnarea={this.addAddressSuccess} ref="child"/> : null
                }

                {
                    that.state.addressDialog || that.state.showError || that.state.showConfirm || that.state.logoutDialog ? <Mask/> : null
                }

                {
                    that.state.showError ? <PopWinodw cancel={that.cancel} custom={that.cancel} popup={that.state.popup}/> : null
                }

                {
                    that.state.showConfirm ? <PopWinodw cancel={that.cancel} custom={that.goToCart} popup={popup}/> : null
                }

                {
                    that.state.logoutDialog ? <PopWinodw cancel={that.stayHere.bind(that)} confirm={that.goLogin.bind(that)} popup={that.state.popup1}/> : null
                }

                <div className="main-content-gd">
                    <div className="navigator">
                        <span>
                        {
                            that.state.categoryArr.length > 0 ? that.state.categoryArr.map(function (item, index) {
                                return (<em> { index>0 && item ? <i>&gt;</i>:null } <a href="javascript: void (0)">{item}</a> </em> )
                            }) : null
                        }
                        </span>
                    </div>
                    <div className="product-intro-content">
                        <div className="preview-wrap">
                            <div className="major-img">
                                <img src={that.state.mainPic ? that.state.mainPic : imgs[0]} onError={ that.changeImg.bind(that) }/>
                            </div>
                            <ul className="img-list">
                                {
                                    imgs.length > 0 ? imgs.map((item, index)=>{
                                                return (<li className={index === 0 ? 'active' : ''} key={index}>
                                                    <img src={item} onError={ that.changeImg.bind(that) }/>
                                                    <div className="one"></div>
                                                    <div className="two"></div>
                                                    <div className="three"></div>
                                                    <div className="four"></div>
                                                </li>)
                                    }):null
                                }
                            </ul>
                            <ul className="bottom-icons-wrap">
                                <li className="collection">收藏</li>
                                <li className="share" style={{display:'none'}}>分享</li>
                                <li className="shui">商品包税</li>
                                <li className="zheng">正品保障</li>
                                <li className="sevenday">7天无忧退货</li>
                            </ul>
                        </div>
                        <div className="product-info-wrap">
                            <div className="product-title">{goodsInfo.goodsName}</div>
                            <div className="sub-title">{goodsInfo.goodsKeywords}</div>
                            <div className="price-wrap">
                                {
                                    that.state.goodsStatus == 21 ?
                                        <div className="summary">
                                            <div className="xiajia">商品已下架，去看看其他商品吧。</div>
                                        </div> :
                                        that.state.goodsVipPrice ?
                                        <div>
                                            <div className="summary">
                                                <div className="dt mt13"><span className="w3">乐虎价</span></div>
                                                <div className="dd h30"><span className="price vip"><i>￥</i>{that.state.goodsVipPrice}</span></div>
                                            </div>
                                            <div className="summary mt5">
                                                <div className="dd h30"><span className="price black"><i>￥</i>{that.state.goodsPrice}</span></div>
                                            </div>
                                        </div> :
                                        <div className="summary">
                                            <div className="dt mt13"><span className="w3">乐虎价</span></div>
                                            <div className="dd h30"><span className="price"><i>￥</i>{that.state.goodsPrice}</span></div>
                                        </div>
                                }
                                {
                                    promotionInfo.activityName ?
                                        <div className="summary">
                                            <div className="dt"><span className="w2">促销</span></div>
                                            <div className="dd mb6"><span className="full-cut" style={{display:'none'}}></span>{promotionInfo.activityName}</div>
                                        </div> : null
                                }
                            </div>
                            {
                                that.state.goodsStatus != 21 ?
                                    <div className="area-wrap">
                                        <div className="summary">
                                            <div className="dt"><span className="w3">配送至</span></div>
                                            <div className="dd">
                                                <div className="area-content">
                                                    <a className="select-area"><del>{that.state.address ? that.state.address : '江苏省 南京市 江宁区'}</del><i></i></a><em>&nbsp;</em>
                                                    <div className="select-wrap">
                                                        <div className="select-content">
                                                            <ul className="select-tabs">
                                                                <li className="current"><p>请选择</p></li>
                                                                <li><p>请选择</p></li>
                                                                <li><p>请选择</p></li>
                                                            </ul>
                                                            <div className="tab-content">
                                                                <ul className="first-area">
                                                                    <li>

                                                                    </li>
                                                                </ul>
                                                                <ul className="second-area">
                                                                    <li>

                                                                    </li>
                                                                </ul>
                                                                <ul className="third-area">
                                                                    <li>

                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="summary">
                                            <div className="dt"><span className="w2">运费</span></div>
                                            <div className="dd">{that.state.range === 1 ? that.state.goodsInfo.addressFreight.freightInfo : '不在配送范围内'}</div>
                                        </div>
                                    </div> : null
                            }

                            <div className="spec-wrap">
                                {
                                    specList.length > 0 ? specList.map((item, index)=>{
                                        return (
                                        <div className="summary lh32" key={item.specId}>
                                            <div className="dt"><span className={item.specName.length === 2 ? 'w2' : (item.specName.length === 3 ? 'w3' : 'w4')}>{item.specName}</span></div>
                                            <div className="dd">
                                                <ul className="text-spec">
                                                    {
                                                        item.specDetail.length > 0 ? item.specDetail.map((item2)=>{
                                                            let active = that.isInArray(specArr, item2.specDetailId);
                                                            let isValid = that.isValid(that.state.allValidSpecArr, item2.specDetailId, index);
                                                            return (
                                                                <li id={item2.specDetailId} key={item2.specDetailId} onClick={that.selectSpec.bind(that, index, item2.specDetailId)} className={active ? 'active' : (isValid ? '' : 'spec-disable') }>
                                                                    <a><span>{item2.specDetailName}</span><i></i></a>
                                                                </li>
                                                            )
                                                        }):null
                                                    }
                                                </ul>
                                            </div>
                                        </div>)
                                    }):null
                                }
                                <div className="summary" style={that.state.goodsStatus == 21 ? {display:'none'} : {}}>
                                    <div className="dt"><span className="w2">库存</span></div>
                                    <div className="dd">剩余 {goodsQty} 件 <i style={{color:'#ed3a4a'}}>{!!goodsQty ? '' : '(商品缺货)'}</i></div>
                                </div>

                                <div className="summary lh32" style={that.state.goodsStatus == 21 ? {display:'none'} : {}}>
                                    <div className="dt"><span className="w2">数量</span></div>
                                    <div className="dd">
                                        <a className={!!goodsQty && that.state.sumNum >= (that.state.goodsStartNum + that.state.goodsMultipleNum) ? "decrease" : "decrease disabled"} onClick={that.decreaseNum}>-</a>
                                        <input className="input-sum" type="text" value={that.state.sumNum} onChange={that.textChange.bind(that)}/>
                                            <a className={!!goodsQty && that.state.sumNum <= (goodsQty - that.state.goodsMultipleNum) && goodsQty > that.state.goodsStartNum? "increase" : "increase disabled"} onClick={that.increaseNum}>+</a>
                                    </div>
                                </div>
                                <div className="summary" style={that.state.goodsStatus == 21 ? {display:'none'} : {marginTop: '24px'}}>
                                    <div className="dd">
                                        <a className={!!goodsQty ? 'btn buy' : 'btn buy buy-disable'} onClick={that.buyGoods}>立即购买</a>
                                        <a className={!!goodsQty ? 'btn add2cart' : 'btn add2cart add2cart-disable'} onClick={that.add2Cart}>加入购物车</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<div className="small-window-wrap" style={{position: 'absolute',top: 0,right: '-210px',textAlign: 'center',display:'none'}}>
                            <div className="window-title">看了又看</div>
                            <ul>
                                <li><a><img src="images/white.jpg"/><span>苹果（Apple）iphone 8 金色移动联通电信全网通4G手机</span><i>￥5888.00</i></a></li>
                                <li><a><img src="images/white.jpg"/><span>苹果（Apple）iphone 8 金色移动联通电信全网通4G手机</span><i>￥5888.00</i></a></li>
                                <li><a><img src="images/white.jpg"/><span>苹果（Apple）iphone 8 金色移动联通电信全网通4G手机</span><i>￥5888.00</i></a></li>
                            </ul>
                        </div>*/}
                    </div>

                    <div className="blow-content">
                        <div className="small-window-wrap" style={{float: 'left'}}>
                            <div className="window-title">推荐商品</div>
                            <ul>
                                {
                                    that.state.suggestGoods.length > 0 ? that.state.suggestGoods.map((goods)=>{
                                        let lowerPrice = -1;
                                        if(goods.goodsPrice >= goods.promotionPirce && goods.promotionPirce > 0){
                                            lowerPrice = goods.promotionPirce;
                                        }else{
                                            lowerPrice = goods.goodsPrice;
                                        }

                                        return (
                                            <li><a href={`${URL}/00000000/${goods.id}.html`} target="_blank"><img onError={ that.changeImg.bind(that) } src={goods.goodsItemImg}/><span>{goods.goodsName}</span><i>￥{lowerPrice}</i></a></li>
                                        )
                                    }) : null
                                }
                            </ul>
                        </div>

                        <div className="switch-tab-content">
                            <div className="nav-tabs">
                                <a className="active">商品详情</a>
                            </div>
                            <div className="details-wrap">

                            </div>

                            <div className="service-wrap" style={{display: 'none'}}>

                            </div>

                            <div className="judge-wrap" style={{display: 'none'}}>

                            </div>
                        </div>
                    </div>
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

export {GoodsDetails}
