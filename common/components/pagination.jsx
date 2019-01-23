/*
* 商品列表
* */

import React, {Component} from 'react';

import '../styles/common.css';
import '../styles/goodsList.css';

class Pagination extends Component{
    constructor(props){
        super(props);
        this.state={
            inputPage: 1,
        }
    }

    componentDidMount() {
        this.setState({
            inputPage: this.props.configs.currentPage,
        })
    }

    clickPage(page){
        if(page === -1){
            page = this.props.configs.currentPage - 1
        }else if(page === 0){
            page = this.props.configs.currentPage + 1
        }
        if(page < 1 || page > this.props.configs.totalPage){
            return;
        }
        this.props.toPage(page);
    }

    confirmBtn(){
        if(this.state.inputPage == this.props.configs.currentPage){
            return;
        }
        this.props.toPage(this.state.inputPage);
    }

    inputVal(e){
        let that = this;
        let elm = e.currentTarget;
        let value = elm.value;
        let reg = /^[0-9]+.?[0-9]*$/;
        if(value.indexOf('.') >= 0){
            value = Math.round(value);
            elm.value = value;
        }
        if(isNaN(value)){
            value = that.state.inputPage
        }
        if (!reg.test(value)) {
            value = that.state.inputPage
        }
        that.setState({
            inputPage: value
        })
    }

    render(){
        const that = this;
        const {currentPage, totalPage, totalNum} = that.props.configs;
        let pageArr = [];
        for(let i = 1; i <= totalPage; i++){
            pageArr.push(i)
        }
        let belowRender ,overRender = false;

        return(
            <div id="pagination" className="mb-40 clearfix">
                <div className="pagination">
                    <a className={currentPage == 1 ? 'prev current' : 'prev'} onClick={that.clickPage.bind(that, -1)}>上一页</a>
                    {
                        totalPage > 0 ? pageArr.map((item,index)=>{
                            index ++;

                            if(index === 1 || index === totalPage){
                                return(
                                    <a className={currentPage == index ? 'current' : ''} onClick={currentPage != index ? that.clickPage.bind(that, index) : null}>{index}</a>
                                )
                            }

                            if(totalPage >= 8 && currentPage >= 5){
                                if(index >= currentPage -2 && index <= currentPage + 1){
                                    return (
                                        <a className={currentPage == index ? 'current' : ''} onClick={currentPage != index ? that.clickPage.bind(that, index) : null}>{index}</a>
                                    )
                                }else if(index <= 3 && !belowRender){
                                    belowRender = true;
                                    return (
                                        <span>…</span>
                                    )
                                }else if(index > currentPage + 1 && !overRender){
                                    overRender = true;
                                    return (
                                        <span>…</span>
                                    )
                                }
                            }else if(totalPage >= 8){
                                if(index <= 5){
                                    return (
                                        <a className={currentPage == index ? 'current' : ''} onClick={currentPage != index ? that.clickPage.bind(that, index) : null}>{index}</a>
                                    )
                                }else if(!overRender){
                                    overRender = true;
                                    return (
                                        <span>…</span>
                                    )
                                }
                            }else{
                                return (
                                    <a className={currentPage == index ? 'current' : ''} onClick={currentPage != index ? that.clickPage.bind(that, index) : null}>{index}</a>
                                )
                            }
                        }) : null
                    }
                    <a className={currentPage == totalPage ? 'next current' : 'next'} onClick={that.clickPage.bind(that, 0)}>下一页</a>
                    <div className="page-info">共{totalNum}条，共{totalPage}页</div>
                    <input type="text" value={that.state.inputPage} className="jumpipt jumpPage" onChange={that.inputVal.bind(that)}/>
                    <a className="jumpipt jumpBtn" onClick={that.confirmBtn.bind(that)}>确定</a>
                </div>
            </div>
        )
    }
}

export {Pagination}
