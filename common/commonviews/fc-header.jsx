/*
 * 购物车
 * */

import React, {Component} from 'react';

import '../styles/common/fc-header.css';

class FcHeader extends Component{
    constructor(props){
        super(props);

        this.state = {
            InputValue: '',  //输入框内容
        };

        //事件绑定
        this.goSearch = this.goSearch.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.goHome = this.goHome.bind(this);

    }

    componentDidMount() {
        let that = this;
        //对enter回车键做事件绑定
        document.addEventListener('keypress',function (e) {
            if(e.keyCode == 13){
                that.goSearch(e);
            }
        },false)
    }

    //搜索
    goSearch(e){
        e.stopPropagation();
        const {InputValue} = this.state;
        window.open('goodsList.html?keyword=' + escape(InputValue) + '&mark=1');
    }

    //改变输入值
    changeValue(e){
        let Value = e.currentTarget.value;
        this.setState({InputValue: Value});
    }

    //去首页
    goHome(e){
        e.stopPropagation();
        window.open('/');
    }

    componentWillUnmount() {
        let that = this;
        document.addEventListener('keypress',function (e) {
            if(e.keyCode == 13){
                that.goSearch(e);
            }
        },false)
    }

    render(){
        const {InputValue} = this.state;
        return(
            <div className="hy-search">
                <div className="hy-search-logo" onClick={(e) => this.goHome(e)}>
                </div>
                <div className="hy-search-cart">
                    <input type="text" className="hy-search-form text" maxLength={30} style={{color: 'rgb(51,51,51)'}}
                           placeholder="请输入商品" value={InputValue} onChange={(e) => this.changeValue(e)}/>
                    <a href="javascript: void (0)" onClick={(e) => this.goSearch(e)}>搜索</a>
                </div>
            </div>
        )
    }
}

export {FcHeader}

