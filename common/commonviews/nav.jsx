/*
 * 顶部导航
 * */

import React, {Component} from 'react';

//引入css
import '../styles/common/nav.css';

class Nav extends Component {
    constructor(props) {
        super(props);
        //事件绑定
        this.AccountCenter = this.AccountCenter.bind(this);
        this.orderManagement = this.orderManagement.bind(this);
        this.jumpHome = this.jumpHome.bind(this);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    //跳转账户中心
    AccountCenter(e) {

        window.location.href = "/personal.html"

    }

    //跳转订单管理页面
    orderManagement(e) {

        window.location.href = "/orderManage.html"

    }

    //跳转首页
    jumpHome() {

        window.location.href = "/"

    }

    render() {
        let that = this;
        const {pageType} = this.props;
        return (
            <div className="nav">
                <div className="w">
                    <img src={require('../images/logo_bai.png')} onClick={(e) => that.jumpHome(e)}/>
                    {
                        pageType.t_pageStatus ?
                            <ul>
                                <li className="selector"
                                    onClick={(e) => that.orderManagement(e)}>订单管理
                                </li>
                                <li className="selector"
                                    onClick={(e) => that.AccountCenter(e)}>账户管理
                                </li>
                            </ul>
                            :
                            <ul>
                                <li className={pageType.pageStatus == 1 ? "highLight" : "selector"}
                                    onClick={pageType.pageStatus != 1 ? ((e) => that.orderManagement(e)) : null}>订单管理
                                </li>
                                <li className={pageType.pageStatus == 0 ? "highLight" : "selector"}
                                    onClick={pageType.pageStatus != 0 ? ((e) => that.AccountCenter(e)) : null}>账户管理
                                </li>
                            </ul>
                    }

                </div>
            </div>
        )
    }
}

export {Nav}
