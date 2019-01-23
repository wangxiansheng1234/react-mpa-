/*
* 加入购物车loading
* */

import React, {Component} from 'react';

import '../styles/common/loading.css';

class Loading extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id="loading">
                <div className="loading-content"></div>
            </div>
        )
    }
}

export {Loading}