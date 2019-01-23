/*
 *遮罩层
 * */

import React, {Component} from 'react';

//引入css
import '../styles/common/mask.css';

class Mask extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div className="mask" onClick={this.props.picMaxHide}></div>
        )
    }
}

export {Mask}
