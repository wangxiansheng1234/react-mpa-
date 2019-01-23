
/*
* 商品列表
* */

import React, {Component} from 'react';

import '../styles/common.css';
import '../styles/goodsList.css';

import {Pagination} from './pagination';
import {HeaderTop} from '../commonviews/header-top';
import {SearchHeader} from '../commonviews/search-header';
import {FooterNav} from '../commonviews/footer';
import {CopyRight} from '../commonviews/copyRight';
import {ToolBar} from '../commonviews/tool-bar';
import {Loading} from '../commonviews/loading';

import {ApiPost, ApiGet, getTimeStamp} from '../config/api';
import {encription} from "../util/query";
import {parseQueryString} from "../util/query";

class GoodsList extends Component{
    constructor(props) {
        super(props);

        this.timeStamp = Date.parse(new Date());

        this.sortMode = 0;
        this.sortType = 1;
    }

    componentWillMount() {
        this.state = {
            keyword: '',
            id: 0,
            originId: 0,
            mark: 2,
            catId: 0,
            skuId: 0,
            floorId: 0,
            seckillId: 0,
            freightId: 0,
            dataSet: [],
            isLoading: false,
            sortMode: 0,
            sortType: 1,
            totalPage: 1,
            totalNum:0,
            toPage: 1,
            paramsData: {},
            hotWords: [],
            navi:[],
            category:[],
            firstCatId: 123,
            firstCatArr: [],
            secondCatId: 134,
            secondCatName: '',
            secondCatArr:[],
            thirdCatId: -1,
            thirdCatName: '',
            thirdCatArr: [],
            from: '',
        };
    }

    componentDidMount() {
        let url = window.location.href;
        let that = this;
        let params = parseQueryString(url);
        that.setState({
            mark: params.mark ? Number(params.mark) : 0,
            firstCatId:params.first ? Number(params.first) : 0,
            secondCatId:params.second ? Number(params.second) : 0,
            thirdCatId:params.third ? Number(params.third) : 0,
            keyword:params.keyword || '',
            id: params.id ? Number(params.id) : -1,
            originId: params.originId ? Number(params.originId) : -1,
            skuId: params.skuId ? Number(params.skuId) : -1,
            floorId: params.floorId ? Number(params.floorId) : -1,
            seckillId: params.seckillId ? Number(params.seckillId) : -1,
            freightId: params.freightId ? Number(params.freightId) : -1,
            imgUrl: params.imgUrl ? params.imgUrl : '',
            from: params.from ? params.from : 1,
        },function () {
            if(params.mark && params.mark == 2){
                if(params.third != 0){
                    that.requestGoodsList();
                }
                that.requestSecondCardArr();
            }else{
                that.requestGoods();
            }
        });

        that.initTopSearchNav();
    }

    //初始化搜索控件
    initTopSearchNav(){
        this.initHotWords();
        this.initNavCat();
        this.initNavTab();
    }

    initHotWords(){
        let that = this;
        //热搜词
        let paramsH = {
            url: '/mobile-web-trade/ws/mobile/v1/goods/keywords',
            method: 'POST',
        };

        ApiPost(paramsH)
            .then((res) => {
                if(res.code == 1){
                    that.setState({
                        hotWords:res.response.keywordList
                    })
                }else{

                }
            })
            .catch((error) => {
            })
    }

    initNavCat(){
        let that = this;
        //请求分类信息
        let data = {
            catId: 0,
            strToken: 0,
            strUserId: 0,
        };
        let paramst = {
            url: '/mobile-web-trade/ws/mobile/v1/goods/catAllList?sign=' + encription(data),
            method: 'POST',
            params: data,
        };

        ApiPost(paramst)
            .then((res) => {
                if(res.code == 1){
                    that.setState({
                        category:res.response.category
                    })
                }else{

                }
            })
            .catch((error) => {
            })
    }

    initNavTab(){
        let that = this;
        //请求导航信息
        let params = {
            url: '/mobile-web-pc/ws/mobile/v1/index/getPCNagivation',
            method: 'POST',
        };

        ApiPost(params)
            .then((res) => {
                if(res.code == 1){
                    that.setState({
                        navi:res.navi
                    })
                }else{

                }
            })
            .catch((error) => {
            })
    }

    requestGoods(){
        let that = this;
        that.requestGoodsList(that.state.mark, that.state.sortMode, that.state.sortType, that.state.toPage, that.state.keyword, that.state.id, that.state.originId, that.state.thirdCatId, that.state.skuId, that.state.floorId, that.state.seckillId, that.state.freightId);
    }

    requestSecondCardArr(){
        let that = this;
        that.setState({
            isLoading: true
        });
        let {from} = this.state;
        //初始化数据
        let data = {
            catId: that.state.firstCatId,
            timeStamp: that.timeStamp,
            strUserId: 0,
            strToken: 0,
        };

        let param = {
            url: '/mobile-web-trade/ws/mobile/v1/goods/' + (from == 0 ? 'catAllList' : 'cat2List'  ) + '?sign=' + encription(data),
            method: "post",
            params: data
        };

        ApiPost(param)
            .then((res) => {
                that.setState({
                    isLoading: false
                });
                if(res.code === 1){
                    if(that.state.secondCatId > 0){
                        res.response.category.map((item)=>{
                            //find second level
                            if(item.catId === that.state.secondCatId){
                                //have 3rd level
                                if(that.state.thirdCatId <= 0 && item.category.length > 0){
                                    that.setState({
                                        thirdCatArr: item.category,
                                        thirdCatId: item.category[0].catId,
                                        thirdCatName: item.category[0].catName,
                                        secondCatArr:res.response.category,
                                        secondCatName: item.catName
                                    },function () {
                                        that.requestGoods();
                                    })
                                }else if(that.state.thirdCatId > 0 && item.category.length > 0){
                                    let thirdName = ''
                                    item.category.map((temp)=>{
                                        if(that.state.thirdCatId === temp.catId){
                                            thirdName = temp.catName;
                                        }
                                    });
                                    that.setState({
                                        thirdCatArr: item.category,
                                        thirdCatName: thirdName,
                                        secondCatArr:res.response.category,
                                        secondCatName: item.catName
                                    },function () {
                                        that.requestGoods();
                                    })
                                }
                            }
                        });
                    }else{
                        that.setState({
                            thirdCatArr: res.response.category[0].category,
                            thirdCatId: res.response.category[0].category[0].catId,
                            thirdCatName: res.response.category[0].category[0].catName,
                            secondCatArr:res.response.category,
                            secondCatName: res.response.category[0].catName,
                            secondCatId: res.response.category[0].catId
                        },function () {
                            that.requestGoods();
                        })
                    }
                }
            })
            .catch((res) => {
                console.log(res);
                that.setState({
                    isLoading: false
                })
            })
    }

    /**
     *
     * @param mark 1根据关键字搜索//1根据关键字搜索，2根据三级分类搜索，3产地搜索，4收藏列表查询 5根据skuId搜索，6限时购, 7历史浏览记录 8运费模板, 9 楼层商品列表
     * @param sortMode 排序方式0 默认 1销量，2价格
     * @param sortType 排序类型:1,升序，2降序
     * @param toPage 当前页码
     * @param keyword 关键字//关键词（mark=1时必须），通过“热搜词”搜索的需要把ID传给我，格式keyword!id
     * @param id 通过热搜词进入时，需要传入这个id
     * @param originId 产地
     * @param catId//分类ID（mark=2时必须）
     * @param skuId
     * @param floorId  首页活动楼层id
     * @param seckillId 秒杀活动
     * @param freightId 运费模板
     */
    requestGoodsList(mark, sortMode, sortType, toPage, keyword, id, originId, catId, skuId, floorId, seckillId, freightId){
        let that = this;
        that.setState({
            isLoading: true,
        });
        let paramsData = {
            mark: mark,
            originId: originId,
            keywords: (id - 0 > 0) ? keyword + '!' + id : keyword,
            sortMode: sortMode,
            sortType: sortMode === 1 ? 2 : sortType,
            toPage: toPage,
            pageRows: 50,
            seckillId:seckillId,
            catId: catId,
            skuId: skuId,
            floorId: floorId,
            freightId: freightId,
            userId: that.user ? (that.user.userId || '') : '',
            source:0 //默认只显示pc端商品
        };

        console.log(paramsData)

        let param = {
            url: "/mobile-web-search/ws/mobile/v1/search/list",
            method: "post",
            params: paramsData
        };

        ApiPost(param)
            .then((res) => {
                if(res.code === 1){
                    if(that.sortType !== sortType || that.sortMode !== sortMode){
                        return;
                    }
                    that.setState({
                        dataSet: res.response.goodsListVO.list,
                        isLoading: false,
                        totalPage: res.response.goodsListVO.totalPages,
                        totalNum:res.response.goodsListVO.total,
                        paramsData: paramsData,
                        nomore: false
                    });
                }else{
                    that.setState({
                        dataSet: [],
                        isLoading: false
                    })
                }
            })
            .catch((res) => {
                that.setState({
                    dataSet: [],
                    isLoading: false
                })
            })
    }

    requestParentsCat(catId){
        let that = this;

        //初始化数据
        let data = {
            catId: catId,
            timeStamp: that.timeStamp,
            strUserId: 0,
            strToken: 0,
        };

        let param = {
            url: '/mobile-web-trade/ws/mobile/v1/goods/catParentList?sign=' + encription(data),
            method: "post",
            params: data
        };

        ApiPost(param)
            .then((res) => {
            })
            .catch((res) => {
            })
    }

    redToPage(page){
        let that = this;
        page = Number(page);
        if(page > that.state.totalPage || page < 1){
            return;
        }
        that.setState({
            toPage: page,
            dataSet:[]
        },function () {
            that.requestGoods();
        });

        window.scroll(0, 0);
    }

    //二级目录点击事件
    clickSecondCat(catId, catName){
        let that = this;

        that.state.secondCatArr.map((item)=>{
            //find second level
            if(item.catId === catId){
                that.setState({
                    thirdCatArr: item.category,
                    thirdCatId: item.category[0].catId,
                    thirdCatName: item.category[0].catName,
                    secondCatName:catName,
                    secondCatId: item.catId,
                    dataSet:[]
                }, function () {
                    that.requestGoods();
                })
            }
        });

    }

    //三级目录点击事件
    clickThirdCat(catId, catName){
        let that = this;
        that.setState({
            thirdCatId: catId,
            thirdCatName: catName,
            dataSet:[]
        }, function () {
            that.requestGoods();
        });
        that.requestParentsCat(catId);
    }

    clickSortMode(sortMode){
        let that = this;

        let sortType = that.state.sortType;
        if(that.state.sortMode === sortMode && sortMode !== 2){
            return;
        }
        if(that.state.sortMode === 2 && sortMode === 2){
            sortType = (that.state.sortType === 1 ? 2 : 1);
        }
        //排序时，点击过快，用来判断当前模式，抛弃不必要的渲染。
        this.sortMode = sortMode;
        this.sortType = sortType;
        that.setState({
            sortMode: sortMode,
            sortType: sortType,
            dataSet:[],
        }, function () {
            that.requestGoods();
        })
    }

    changeImg(e){
        let element = e.currentTarget;
        element.src = require('../images/def-goods.jpg');
    }

    render(){
        const that = this;
        let configs = {currentPage:that.state.toPage, totalPage:that.state.totalPage, totalNum:that.state.totalNum};
        let {hotWords, navi, category} = that.state;
        let backgroundImg = {background:`url(${that.state.imgUrl}) no-repeat center`};
        return (
            <div className="container">
                {/*顶部*/}
                <HeaderTop/>

                {/*搜索*/}
                <SearchHeader hotWords={hotWords} category={category} navi={navi} hide={true} navHide={true}/>

                {
                    that.state.isLoading ? <Loading/> : null
                }


                <div className="top-banner" style={that.state.imgUrl ? {} : {display:'none'}}>
                    <a className="banner" style={backgroundImg}>
                    </a>
                </div>
                <div className="main-container-gl">
                    <div className="selected-filter-container">
                        <ul className="selected" style={that.state.mark == 2 ? {} : {display:'none'}}>
                            <li style={that.state.secondCatName ? {} : {display:'none'}}><a>{that.state.secondCatName}</a></li>
                            <li style={that.state.thirdCatName ? {} : {display:'none'}}><a>{that.state.thirdCatName}</a></li>
                        </ul>
                        <div className="search-result" style={that.state.mark == 1 ? {} : {display:'none'}}>全部结果：<span>{that.state.keyword}</span></div>
                    </div>
                    <div className="filter-container"  style={that.state.mark == 2 ? {} : {display:'none'}}>
                        <div className="filter-wrap">
                            <span>类目 :</span>
                            <ul>
                                {
                                    that.state.secondCatArr.map(function (item, index) {
                                        return (
                                            <li key={item.catId} className={item.catId == that.state.secondCatId ? 'active' : ''} onClick={that.clickSecondCat.bind(that, item.catId, item.catName)}><a>{item.catName}</a></li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        <div className="filter-wrap">
                            <span>分类 :</span>
                            <ul>
                                {
                                    that.state.thirdCatArr.map(function (item, index) {
                                        return (
                                            <li key={item.catId} className={item.catId == that.state.thirdCatId ? 'active' : ''} onClick={that.clickThirdCat.bind(that, item.catId, item.catName)}><a>{item.catName}</a></li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>

                    <div className="sort-container" id="mao">
                        <div className="sort-wrap">
                            <span>排序 :</span>
                            <ul>
                                <li className={that.state.sortMode === 0 ? 'active' : ''} onClick={that.clickSortMode.bind(that, 0)}><a>默认 ↓</a></li>
                                <li className={that.state.sortMode === 1 ? 'active' : ''} onClick={that.clickSortMode.bind(that, 1)}><a>销量 ↓</a></li>
                                <li className={that.state.sortMode === 2 ? 'active' : ''} onClick={that.clickSortMode.bind(that, 2)}><a>{that.state.sortType === 1 ? '价格 ↑' : '价格 ↓'}</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="goods-list-container">
                        {
                            !that.state.isLoading && that.state.dataSet.length > 0 ? that.state.dataSet.map((item)=>{
                                let promotionActive = (item.promotionPirce < item.goodsPrice && item.promotionPirce != 0)
                                return (
                                    <a className="goods-box" key={item.id} href={`00000000/${item.id}.html`} target="_blank">
                                        <div className="goods-img">
                                            <img src={item.goodsItemImg} className="scale" onError={ that.changeImg.bind(that) }/>
                                            <div className="sold-out" style={item.flag != 0 ? {} : {display:'none'}}>
                                                <em>已售罄</em>
                                                <i>Sold out</i>
                                            </div>
                                        </div>
                                        <p>{item.goodsName}</p>
                                        <span><i className={promotionActive ? 'cu' : ''}>￥{promotionActive ? item.promotionPirce : item.goodsPrice}</i><del style={promotionActive ? {} : {display:'none'}}>￥{item.goodsPrice}</del></span>
                                    </a>
                                )
                            }):null
                        }

                        {
                            that.state.dataSet.length === 0 && !that.state.isLoading ? (
                                <div className="no-goods-tip">
                                    <img src={require('../images/icon_ss.png')}/>
                                    <div className="tips">
                                        <p>很抱歉，没有找到{that.state.keyword}相关的商品</p>
                                        <ul>
                                            <li>建议您：</li>
                                            <li>1.看看输入的文字是否有误</li>
                                            <li>2.拆分要搜索的关键字，分成几个词再次搜索</li>
                                        </ul>
                                    </div>
                                </div>
                            ) : null
                        }
                    </div>
                    {
                        that.state.dataSet.length > 0 ? <Pagination configs={configs} toPage={that.redToPage.bind(that)}/> : null
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

export {GoodsList}
