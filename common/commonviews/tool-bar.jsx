/*
 * 工具浮标
 * */

import React, {Component} from 'react';

import '../styles/common/tool-bar.css';

//引入js
import {getUser} from '../util/store';

class ToolBar extends Component {
    constructor(props) {
        super(props);
        //事件绑定
        this.goTop = this.goTop.bind(this);
        this.goPerson = this.goPerson.bind(this);
        this.goCart = this.goCart.bind(this);
    }

    //去顶部
    goTop(e) {
        e.stopPropagation();
        window.scroll(0, 0);
    }

    //去个人中心
    goPerson(e) {
        e.stopPropagation();
        if(!getUser()){
            window.open('/login.html');
        }
        else {
            window.open('/personal.html');
        }
    }

    //去购物车
    goCart(e) {
        e.stopPropagation();
        window.open('/cart.action');
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="hy-tip">
                <ul>
                    <li className="person" onClick={(e) => this.goPerson(e)}>
                        <span>个人中心</span>
                    </li>
                    <li className="cart" onClick={(e) => this.goCart(e)}>
                        <span>购物车</span>
                    </li>
                    <li className="tel">
                        <span>400-100-3762</span>
                    </li>
                    <li className="saoma">
                        <div>
                            去APP上查找
                            您所需的商品
                            <i><img src={require('../images/erweima.png')}/></i>
                        </div>
                    </li>
                    <li className="top" onClick={(e) => this.goTop(e)}></li>
                </ul>
            </div>
        )
    }
}

export {ToolBar}