/*
 * 搜索header
 * */

import React, {Component} from 'react';

import '../styles/common/search-header.css';

import {ApiPost} from '../config/api';

class SearchHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            InputName: '',  //搜索内容
            categoryShow: false, //是否显示全部分类
            cateShow: false,//显示
            searchShow: false, //搜索列表展示
            searchList: [], //搜索结果列表
        };

        //事件绑定
        this.goHome = this.goHome.bind(this);
        this.ShowAll = this.ShowAll.bind(this);
        this.HideAll = this.HideAll.bind(this);
        this.goCart = this.goCart.bind(this);
        this.goSearch = this.goSearch.bind(this);
        this.search = this.search.bind(this);
        this.goNac = this.goNac.bind(this);
        this.goSearchNav = this.goSearchNav.bind(this);
        this.hideSearch = this.hideSearch.bind(this);
        this.showSearch = this.showSearch.bind(this);
        this.goCategory = this.goCategory.bind(this);
        this.goKeyWord = this.goKeyWord.bind(this);
    }

    //去导航页
    goNac(e,item){
        e.stopPropagation();
        if(item.navType == 1){
            window.open(item.linkUrl.indexOf('http://') > -1 ? item.linkUrl : 'http://' + item.linkUrl );
        }
        else {
            window.open('/goodsList.html?first=' + item.firstCatId + '&imgUrl=' + escape(item.imgUrl) + '&mark=2');
        }
    }

    //去首页
    goHome() {
        window.location.href = '/';
    }

    //去购物车
    goCart(e) {
        e.stopPropagation();
        window.open('/cart.action');
    }

    //去热搜词搜索结果页
    goSearch(e, item) {
        e.stopPropagation();
        window.open('/goodsList.html?mark=1&keyword=' + escape(item.keyword)  + '&id=' + item.id);
    }

    //显示隐藏分类
    ShowAll(e) {
        e.stopPropagation();
        this.setState({
            categoryShow: true
        });
        if (this.props.hide) {
            console.log(1);
            this.setState({
                cateShow: true,
            })
        }
    }

    HideAll(e) {
        e.stopPropagation();
        this.setState({
            categoryShow: false
        });
        if (this.props.hide) {
            this.setState({
                cateShow: false,
            })
        }
    }

    //搜索
    search(e) {
        let that = this;
        let Value = e.currentTarget.value;
        if (Value == '') {
            this.setState({
                searchShow: false,
                InputName: Value,
            });
        }
        else {
            this.setState({
                InputName: Value,
            });
            let data = {
                keywords: Value,
            };
            setTimeout(() => {
                that.ApiSearch(data);
            }, 500)
        }
    }

    //请求搜索数据
    ApiSearch(data) {
        let param = {
            url: '/mobile-web-search/ws/mobile/v1/search/suggest',
            params: data
        };
        ApiPost(param)
            .then((data) => {
                if (data.code == 1) {
                    if (data.response.goodsListVO.list.length > 0) {
                        this.setState({
                            searchShow: true,
                            searchList: data.response.goodsListVO.list,
                        });
                    }
                }
            })
            .catch((error) => {
                console.log('服务器错误');
            })
    }

    //去搜索频道页
    goSearchNav(e, id, goodsName) {
        e.stopPropagation();
        window.location.href = '/goodsList.html?mark=5&skuId=' + id + '&keyword=' + (goodsName) + '&from=1';
    }

    //关键字搜索
    goKeyWord(e){
        e.stopPropagation();
        let { InputName } = this.state;
        window.location.href = '/goodsList.html?keyword=' + escape(InputName) + '&mark=1' ;
    }

    //隐藏搜索列表
    hideSearch(e) {
        e.stopPropagation();
        this.setState({
            searchShow: false,
        })
    }

    //显示搜索列表
    showSearch(e) {
        e.stopPropagation();
        if (e.currentTarget.value == '') {
            return false;
        }
        this.setState({
            searchShow: true,
        })
    }

    //分类
    goCategory(e, firstid, twoid) {
        e.stopPropagation();
        window.open('/goodsList.html?first=' + firstid + '&second=' + twoid + '&mark=2&from=0');
    }

    componentDidMount() {
        let that = this;
        //对enter回车键做事件绑定
        document.addEventListener('keypress',function (e) {
            if(e.keyCode == 13){
                that.goKeyWord(e);
            }
        },false)
    }

    componentWillUnmount() {
        let that = this;
        document.addEventListener('keypress',function (e) {
            if(e.keyCode == 13){
                that.goKeyWord(e);
            }
        },false)
    }

    render() {

        const {cateShow, categoryShow, InputName, searchShow, searchList} = this.state;
        const {hotWords, category, navi, hide, navHide} = this.props;

        return (
            <div className="search-content">
                {/*搜索*/}
                <div id="header">
                    <div className="hy-w">
                        <div className="hy-w-logo" onClick={(e) => this.goHome(e)}></div>
                        <div className="hy-w-search" onMouseLeave={(e) => this.hideSearch(e) }>
                            <input type="text" className="text" maxLength={30} style={{color: 'rgb(51,51,51)'}}
                                   placeholder="搜索 乐虎 商品/品牌/店铺" value={InputName} onChange={(e) => this.search(e)}
                                   onClick={(e) => this.showSearch(e)}/>
                            <a href="javascript: void (0)" className="search" onClick={(e) => this.goKeyWord(e)}>搜索</a>
                            {
                                searchShow ?
                                    <ul className="shelper">
                                        {
                                            searchList.map((item, index) => {
                                                return (
                                                    <li key={index}
                                                        onClick={(e) => this.goSearchNav(e, item.id, item.goodsName) }>{item.goodsName}</li>
                                                )
                                            })
                                        }
                                    </ul>
                                    : null
                            }
                        </div>
                        <div className="hy-w-hot fixed">
                            {
                                hotWords.map((item, index) => {
                                    return (
                                        <a href="javascript: void (0)" key={index}
                                           onClick={(e) => this.goSearch(e, item)}>{item.keyword}</a>
                                    )
                                })
                            }
                        </div>
                        <a href="javascript: void (0)" className="hy-w-cart" onClick={(e) => this.goCart(e)}>
                            <span>我的购物车</span><i></i>
                        </a>
                    </div>
                </div>
                {/*分类*/}
                {
                    navHide ?
                        <div className="hy-nav-bar">

                            <div className="bar">
                                <div className="bar-list">
                                    {
                                        navi.map((item, index) => {
                                            return (
                                                <a href="javascript: void (0)" key={index} onClick={(e) => this.goNac(e,item)}>{item.navName}</a>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            <div className="hy-category">
                                <div className="hy-category-tab">
                                    <div className="hy-tab" onMouseMove={(e) => this.ShowAll(e)}
                                         onMouseOut={(e) => this.HideAll(e)}>
                                        <div className="category-type fixed">
                                            <i></i>
                                            <span>商品分类</span>
                                        </div>
                                        <div className={`category-content${categoryShow ? ' hiddens' : '' }`}
                                             style={ hide ? !cateShow ? {display: 'none'} : {display: 'block'} : {display: 'block'} }>
                                            <ul className="">
                                                {
                                                    category.map((item, index) => {
                                                        return (
                                                            <li key={index}>
                                                                {
                                                                    item.category.slice(0, 3).map((itemt, indext) => {
                                                                        return (
                                                                            <a onClick={(e) => {
                                                                                this.goCategory(e, item.catId, itemt.catId)
                                                                            }} href="javascript: void (0)"
                                                                               key={indext}>{indext > 0 ? '/' : ''}{itemt.catName}</a>
                                                                        )
                                                                    })
                                                                }
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : null
                }

            </div>
        )
    }
}
export {SearchHeader}