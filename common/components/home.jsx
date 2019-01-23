/*
 * 首页模块
 * */

import React, {Component} from 'react';

//引入组件
import {HeaderTop} from '../commonviews/header-top';
import {SearchHeader} from '../commonviews/search-header';
import {FooterNav} from '../commonviews/footer';
import {CopyRight} from '../commonviews/copyRight';
import {ToolBar} from '../commonviews/tool-bar';

//引入css
import '../styles/common.css';
import '../styles/home.css';

//引入js
import {ApiPost} from '../config/api';
import {getUser} from '../util/store';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            index: 0, //轮播图当前切换索引值
            show: false, //数据加载
            navi: null, //导航信息
            category: null, //分类信息
            hotWords: null, //热搜词
            banner: [], //banner
            adList: [], //广告位
            floors: null, //楼层展示
        };

        //事件绑定
        this.SwiperOut = this.SwiperOut.bind(this);
        this.SwiperMove = this.SwiperMove.bind(this);
        this.goUrl = this.goUrl.bind(this);
        this.changeBanner = this.changeBanner.bind(this);

    }

    componentWillMount() {
        this.setState({
            navi: this.props.navi,
            category: this.props.category,
            hotWords: this.props.hot,
        });
    }

    componentDidMount() {

        //获取user
        this.user = getUser();

        //请求楼层信息
        this.apiRequest();

        //请求广告位信息
        this.apiAd();

    }

    //楼层信息
    apiRequest() {
        let params = {
            url: '/mobile-web-pc/ws/mobile/v1/index/getPCFloor',
            params: {},
        };
        ApiPost(params)
            .then((data) => {
                if (data.code == 1) {
                    this.setState({
                        show: true,
                        floors: data.pcIndexVO.indexs,
                    }, () => {
                        setTimeout(() => {
                            document.querySelector('.hy-floors').setAttribute('class', 'hy-floors active');
                        }, 300)
                    })
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }

    //广告位
    apiAd() {
        let params = {
            url: '/mobile-web-pc/ws/mobile/v1/index/getPCSliderImage',
            method: 'POST',
            params: {}
        };

        ApiPost(params)
            .then((data) => {
                if (data.code == 1) {
                    this.setState({
                        adList: data.sliders.advPositionList,
                        banner: data.sliders.sliderList,
                    }, () => {
                        if(data.sliders.sliderList.length > 1){
                            this.SetTimer();
                        }
                    })
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }

    //banner页面跳转
    goUrl(e, url) {
        e.stopPropagation();
        window.open(url);
    }

    //banner透明度效果
    SwiperOut(e) {
        e.stopPropagation();
        this.SetTimer();
    }

    SwiperMove(e) {
        e.stopPropagation();
        clearInterval(this.timer);
    }

    SetTimer() {
        let that = this;
        this.timer = setInterval(() => {
            that.switchBanner();
        }, 3000);
    }

    switchBanner() {
        const {index} = this.state;
        let IndexElement = document.querySelectorAll('.hy-swiper-slider')[index];
        let Pagination = document.querySelectorAll('.pagination')[index];
        let Length = document.querySelectorAll('.hy-swiper-slider').length;
        IndexElement.setAttribute('class', 'hy-swiper-slider');
        Pagination.setAttribute('class', 'pagination');
        if (index == Length - 1) {
            this.setState({
                index: 0
            }, () => {
                document.querySelectorAll('.pagination')[this.state.index].setAttribute('class', 'pagination active');
                document.querySelectorAll('.hy-swiper-slider')[this.state.index].setAttribute('class', 'hy-swiper-slider active');
            })
        }
        else {
            this.setState({
                index: index + 1,
            }, () => {
                document.querySelectorAll('.pagination')[this.state.index].setAttribute('class', 'pagination active');
                document.querySelectorAll('.hy-swiper-slider')[this.state.index].setAttribute('class', 'hy-swiper-slider active');
            })
        }
    }

    changeBanner(e, id) {
        e.stopPropagation();

        //清除当前显示banner
        const {index} = this.state;
        let IndexElement = document.querySelectorAll('.hy-swiper-slider')[index];
        let Pagination = document.querySelectorAll('.pagination')[index];
        IndexElement.setAttribute('class', 'hy-swiper-slider');

        Pagination.setAttribute('class', 'pagination');
        //清除定时器
        clearInterval(this.timer);
        //重新设置
        this.setState({
            index: id
        }, () => {
            document.querySelectorAll('.hy-swiper-slider')[id].setAttribute('class', 'hy-swiper-slider active');
            document.querySelectorAll('.pagination')[id].setAttribute('class', 'pagination active');
        });
    }

    componentWillUnmount() {
    }

    render() {

        const {navi, category, hotWords, show, banner, adList, floors} = this.state;

        return (
            <div className="page">

                {/*顶部*/}
                <HeaderTop/>

                {/*搜索*/}
                <SearchHeader hotWords={hotWords} category={category} navi={navi} hide={false} navHide={true}/>

                {/*banner*/}
                <div className="hy-category-banner">
                    {
                        banner.length > 0 ?
                            <div className="hy-banner">

                                <div className="hy-slider">
                                    <div className="hy-swiper-wrap">
                                        {
                                            banner.map((item, index) => {
                                                return (
                                                    <div style={{backgroundColor: '#' + item.backColor + ''}}
                                                         key={index}
                                                         className={`hy-swiper-slider${index == 0 ? ' active' : '' } `}
                                                         onMouseOut={(e) => this.SwiperOut(e)}
                                                         onMouseMove={(e) => this.SwiperMove(e)}
                                                         onClick={(e) => this.goUrl(e, item.linkUrl)}><img
                                                        src={item.imgUrl}/></div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="hy-swiper-pagination">
                                        {
                                            banner.map((item, index) => {
                                                return (
                                                    <span key={index}
                                                          className={`pagination${index == 0 ? ' active' : ''}`}
                                                          onMouseMove={(e) => this.changeBanner(e, index)}></span>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                {/*广告位*/}
                                {
                                    adList.length > 0 ?
                                        <div className="ad">
                                            <div className="hy-ad">
                                                {
                                                    adList.map((item, index) => {
                                                        return (
                                                            <a href="javascript: void (0)" key={index}
                                                               onClick={(e) => this.goUrl(e, item.linkUrl)}><img
                                                                src={item.imgUrl}/></a>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                        : null
                                }
                            </div>
                            : null
                    }
                </div>

                {/*floors*/}
                <div className="hy-content">
                    {
                        show ?
                            <div className="hy-floors">

                                {/*楼层信息*/}
                                {
                                    floors.map((item, index) => {
                                        return (
                                            item.type == 1 ?
                                                <HotActivity index={index} msg={item}/>
                                                : item.type == 2 ?
                                                <HighGoods index={index} msg={item}/>
                                                : item.type == 3 ?
                                                    <Floor index={index} msg={item}/>
                                                    : item.type == 4 ?
                                                        <Banner index={index} msg={item}/>
                                                        : null
                                        )
                                    })
                                }
                            </div>
                            : null
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

//热门活动
class HotActivity extends Component {
    constructor(props) {
        super(props);

        //事件绑定
        this.goUrl = this.goUrl.bind(this);
    }

    //跳转url
    goUrl(e, url) {

        e.stopPropagation();
        window.open(url);
    }

    render() {

        const {msg} = this.props;

        return (
            <div className="hy-floor-f">
                <div className="floor-title">
                    <p>{msg.floorTitle}</p>
                </div>
                {
                    msg.details.length > 0 ?
                        <div className="floor-content fixed">
                            <div className="hot-banner-f" onClick={(e) => this.goUrl(e, msg.details[0].linkUrl)}>
                                <img src={msg.details[0].imgUrl}/>
                            </div>
                            <div className="hot-banner-s" onClick={(e) => this.goUrl(e, msg.details[1].linkUrl)}>
                                <img src={msg.details[1].imgUrl}/>
                            </div>
                            <div className="hot-banner-s" onClick={(e) => this.goUrl(e, msg.details[2].linkUrl)}>
                                <img src={msg.details[2].imgUrl}/>
                            </div>
                        </div>
                        : null
                }

            </div>
        )
    }

}

//精品推荐
class HighGoods extends Component {
    constructor(props) {
        super(props);

        //事件绑定
        this.goUrl = this.goUrl.bind(this);
        this.goDetail = this.goDetail.bind(this);
    }

    goUrl(e, url) {
        e.stopPropagation();
        window.open(url);
    }

    goDetail(e, id) {
        e.stopPropagation();
        window.open('/00000000/' + id + '.html');
    }

    render() {
        const {msg} = this.props;
        return (
            <div className="hy-floor-t">
                <div className="floor-title">
                    <p>{msg.floorTitle}</p>
                </div>
                <div className="floor-content">
                    <div className="floor-content-fl" onClick={(e) => this.goUrl(e, msg.url)}>
                        <img src={msg.img}/>
                    </div>
                    <div className="floor-content-fr fixed">
                        {
                            msg.details.map((item, index) => {
                                return (
                                    <a href="javascript: void (0)" key={index}
                                       onClick={(e) => this.goDetail(e, item.productItemId)}>
                                        <i><img className="scale" src={item.imgUrl}/></i>
                                        <p>{item.productName}</p>
                                        {
                                            item.price == '' ?
                                                <em>
                                                    <span>￥{item.originalPrice}</span>
                                                </em>
                                                :
                                                <em>
                                                    <span className="member">￥{item.price}</span>
                                                    <b>￥{item.originalPrice}</b>
                                                </em>
                                        }
                                    </a>)
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

//广告Banner
class Banner extends Component {
    constructor(props) {
        super(props);

        //事件绑定
        this.goUrl = this.goUrl.bind(this);
    }

    //页面跳转
    goUrl(e, url) {
        e.stopPropagation();
        window.open(url);
    }

    render() {
        const {msg} = this.props;
        return (
            <div className="hy-floor-s">
                <div className="hy-banner" onClick={(e) => this.goUrl(e, msg.url) }>
                    <img src={msg.img}/>
                </div>
            </div>
        )
    }
}

//楼层展示
class Floor extends Component {
    constructor(props) {
        super(props);
        //事件绑定
        this.goUrl = this.goUrl.bind(this);
        this.goDetail = this.goDetail.bind(this);
    }

    //页面跳转
    goUrl(e, url) {
        e.stopPropagation();
        window.open(url);
    }

    //跳转到商品详情
    goDetail(e, id) {
        e.stopPropagation();
        window.open('/00000000/' + id + '.html');
    }

    render() {
        const {msg} = this.props;
        return (
            <div className="hy-floor-r">
                <div className="floor-tint">
                    <span>{msg.floorTitle}</span>
                </div>
                <div className="floor-content">
                    <div className="floor-content-fl">
                        <a href="javascript: void (0)" onClick={(e) => this.goUrl(e, msg.adFirstUrl)}>
                            <img src={msg.adFirstImg}/>
                        </a>
                        <a href="javascript: void (0)" onClick={(e) => this.goUrl(e, msg.adSecondUrl)}>
                            <img src={msg.adSecondImg}/>
                        </a>
                    </div>
                    <div className="floor-content-fr fixed">
                        {
                            msg.details.map((item, index) => {
                                return (
                                    <a href="javascript: void (0)" key={index}
                                       onClick={(e) => this.goDetail(e, item.productItemId)}>
                                        <i><img className="scale" src={item.imgUrl}/></i>
                                        <p>{item.productName}</p>
                                        {
                                            item.price == '' ?
                                                <em>
                                                    <span>￥{item.originalPrice}</span>
                                                </em>
                                                :
                                                <em>
                                                    <span className="member">￥{item.price}</span>
                                                    <b>￥{item.originalPrice}</b>
                                                </em>
                                        }
                                    </a>
                                )
                            })
                        }
                    </div>
                    <div className="floor-brand">
                        {
                            msg.brandInfo.map((item, index) => {
                                return (
                                    <a href="javascript: void (0)" key={index}>
                                        <img src={item.brandImgUrl}/>
                                    </a>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export {Home}

