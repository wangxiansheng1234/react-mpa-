/*
 * 支付状态栏
 * */

import React, {Component} from 'react';

import '../styles/common/pay-status.css';

class PayStatus extends Component{
    constructor(props){
        super(props);
    }
    render(){
        const {status} = this.props;
        return(
            <ul className="pay-status fixed">
                <li className="done">
                    <div>
                        <em>1</em>
                        <span>我的购物车</span>
                    </div>
                </li>
                <li className={`proce${status > 1 ? ' done' : ' ready'}`}></li>
                <li className={status > 1 ? 'done' : 'wait'}>
                    <div>
                        <em>2</em>
                        <span>填写核对订单</span>
                    </div>
                </li>
                <li className={`proce${status > 2 ? ' done' : status == 2 ? ' ready' : ' wait' }`}></li>
                <li className={status > 2 ? 'done' : 'wait'}>
                    <div>
                        <em>3</em>
                        <span>支付</span>
                    </div>
                </li>
                <li className={`proce${status > 3 ? ' done' : status == 3 ? ' ready' : ' wait' }`}></li>
                <li className={status > 3 ? 'done' : 'wait'}>
                    <div>
                        <em>4</em>
                        <span>完成</span>
                    </div>
                </li>
            </ul>
        )
    }
}

export {PayStatus}
