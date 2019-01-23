/**
 * Created by niwei on 2018/3/16.
 */

function Swiper(element) {

    //获取图片上数组
    let WrapElement = document.querySelector(element);

    //图片长度
    let Length = document.querySelectorAll('.hy-swiper-slider').length;

    //向下标塞数据
    let html = '';
    for(let i = 0; i < Length; i ++){
        if(i == 0){
            html += '<span class="active"></span>';
        }
        else {
            html += '<span></span>';
        }

    }
    document.querySelector('.hy-swiper-pagination').innerHTML = html;

}

let swiper = new Swiper('.hy-slider');
