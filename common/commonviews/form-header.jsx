/*
* 登录注册页面头部
* title: 组件显示名称
* rightLogin: //是否显示登录
* */

import React, {Component} from 'react';

import '../styles/common/form-header.css';

class FormHeader extends Component{
    constructor(props){
        super(props);
        //事件绑定
        this.goLogin = this.goLogin.bind(this);
        this.goHome = this.goHome.bind(this);
    }

    //去登录
    goLogin(e){
        e.stopPropagation();
        window.location.href = '/login.html';
    }

    //去首页
    goHome(e){
        e.stopPropagation();
        window.location.href = '/';
    }

    render(){
        const {title,rightLogin} = this.props;
        return (
            <div className="form-header">
                <div className="form-w">
                    <div className="form-logo fixed">
                        <a href="javascript: void (0)" className="home-logo" onClick={(e) => this.goHome(e)}></a>
                        <div className="logo-title">{title}</div>
                    </div>
                    {
                        rightLogin ? null :
                            <div className="have-account">
                                已有账户,<a href="javascript: void (0)" className="go-login" onClick={this.goLogin}>请登录</a>
                            </div>
                    }
                </div>
            </div>
        )
    }
}

export {FormHeader}