/*
 * 弹窗提示
 *   popup: {
 title: '确定要删除商品?', //弹窗提示名称
 btnShow: true,  //是否显示删除按钮
 leftBtn: '确认',
 rightBtn: '取消',
 knowTitle: '', //按钮名称
 }
 * */

import React, {Component} from 'react';

import '../styles/common/popup-window.css';

class PopWinodw extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {popup} = this.props;
        return (
            <div className="goods-delete-tip">
                <div className="delete-tip">
                    {
                        popup.close ? null :
                            <a href="javascript: void (0)" className="close" onClick={this.props.cancel}></a>
                    }
                    <div className="tip-msg">
                        <i className={popup.success ? 'active' : ''}></i>
                        <span>{popup.title}</span>
                    </div>
                    {
                        popup.btnShow ?
                            <div className="tip-btn fixed">
                                <a href="javascript: void (0)" className="confirm"
                                   onClick={this.props.confirm}>{popup.leftBtn}</a>
                                <a href="javascript: void (0)" className="cancel"
                                   onClick={this.props.cancel}>{popup.rightBtn}</a>
                            </div>
                            :
                            <a className="know" href="javascript: void (0)" onClick={this.props.custom}>{popup.knowTitle ? popup.knowTitle: '知道了'}</a>
                    }
                </div>
            </div>
        )
    }
}

export {PopWinodw}