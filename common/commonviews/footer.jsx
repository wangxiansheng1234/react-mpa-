/*
 * 底部导航
 * */

import React, {Component} from 'react';

//引入css
import '../styles/common/footer.css';

class FooterNav extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {

        return (
            <div className="hy-footer">

                <div className="mod-help-list fixed">
                    <div className="mod-help-nav">
                        <h5>新手上路</h5>
                        <ul>
                            <li><a href="javascript: void (0)">用户登录</a></li>
                            <li><a href="javascript: void (0)">找回密码</a></li>
                            <li><a href="javascript: void (0)">购物流程</a></li>
                            <li><a href="javascript: void (0)">联系客服</a></li>
                        </ul>
                    </div>
                    <div className="mod-help-nav">
                        <h5>店主之家</h5>
                        <ul>
                            <li><a href="javascript: void (0)">如何申请开店</a></li>
                            <li><a href="javascript: void (0)">如何发布商品</a></li>
                            <li><a href="javascript: void (0)">查看售出商品</a></li>
                            <li><a href="javascript: void (0)">支付流程</a></li>
                        </ul>
                    </div>
                    <div className="mod-help-nav">
                        <h5>关于我们</h5>
                        <ul>
                            <li><a href="javascript: void (0)">汇银乐虎简介</a></li>
                            <li><a href="javascript: void (0)">服务条款</a></li>
                            <li><a href="javascript: void (0)">法律声明</a></li>
                            <li><a href="javascript: void (0)">隐私声明</a></li>
                        </ul>
                    </div>
                    <div className="mod-help-nav">
                        <h5>服务咨询</h5>
                        <ul>
                            <li><a href="javascript: void (0)">400-100-3762</a></li>
                            <li><a href="javascript: void (0)">每天24小时在线</a></li>
                            <li><a href="javascript: void (0)">正品承诺</a></li>
                        </ul>
                    </div>
                    <div className="mod-help-cover">
                        <h5>汇银乐虎供应链</h5>
                        <span>
                            <i></i>
                            下载移动客户端
                          </span>
                    </div>
                </div>
            </div>
        )
    }
}

export {FooterNav}