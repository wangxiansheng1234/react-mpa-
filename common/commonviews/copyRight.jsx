/*
 * copyRight
 * */

 import React, {Component} from 'react';

 import '../styles/common/copyright.css';

 class CopyRight extends Component {
     constructor(props){
         super(props);
     }

     componentDidMount() {

     }

     componentWillUnmount() {

     }

     render(){

         return(
             <div className="hy-copyright">

                 <div className="mod-copyright-inner">
                     <div className="mod-inner-content">
                         <p>苏ICP备17058215号-1  |  Copyright  ©  2014-2018  hylhb2b.com汇银乐虎版权所有</p>
                         <div><span>公司地址:南京市江宁区将军大道</span><em>电话: 400-100-3762</em></div>
                     </div>
                 </div>

             </div>
         )
     }
 }

 export {CopyRight}