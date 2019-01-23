/**
 * Created by wangpeng on 2018/5/7.
 * 根据开发和生产环境来选择不同的请求host
 */

const http_url = () => {
    if (process.env.NODE_ENV == 'development') {
        return 'http://b2b-test.see-more.cn:8889';
    } else {
        return 'http://app.hylhb2b.com';
    }
};

export {http_url}
