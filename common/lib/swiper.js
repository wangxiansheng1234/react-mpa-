/**
 * Created by niwei on 2018/3/16.
 */

let Swiper = (element) => {
    let that = this;
    let init = {
        index: 0, //排序
    };

    let obj = document.querySelectorAll('div.hy-swiper-slider');

    //图片长度
    let Length = document.querySelectorAll('.hy-swiper-slider').length;

    for (let i = 0; i < Length; i++) {
        let objCase = obj[i];
        objCase.addEventListener('mouseover', function (event) {
            clearInterval(this.timer);
        }, false);
        objCase.addEventListener('mouseout', function (event) {
            InterTime();
        }, false);
    }

    let InterTime = () => {
        this.timer = setInterval(() => {
            //获取当前展示的图片
            let IndexElement = document.querySelectorAll('.hy-swiper-slider')[init.index];
            IndexElement.setAttribute('class', 'hy-swiper-slider');
            if (init.index == Length - 1) {
                init.index = 0;
            }
            else {
                init.index++;
            }
            document.querySelectorAll('.hy-swiper-slider')[init.index].setAttribute('class', 'hy-swiper-slider active');
        }, 5000);
    };

    InterTime();

    //向下标塞数据
    let html = '';
    for (let i = 0; i < Length; i++) {
        if (i == 0) {
            html += '<span class="active"></span>';
        }
        else {
            html += '<span></span>';
        }

    }
    document.querySelector('.hy-swiper-pagination').innerHTML = html;

};

export {Swiper}
