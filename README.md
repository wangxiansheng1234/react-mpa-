#项目文档结构说明

https://github.com/laoqiren/isomorphic-redux-CNode

http://www.ruanyifeng.com/blog/2016/01/babel.html

项目基本框架来源

react中添加同构

目的
这问题首先我们要给出为什么使用服务端渲染，主要基于以下三点
1.利于SEO：React服务器渲染的方案使你的页面在一开始就有一个HTML DOM结构，方便Google等搜索引擎的爬虫能爬到网页的内容。
2.提高首屏渲染的速度：服务器直接返回一个填满数据的HTML，而不是在请求了HTML后还需要异步请求首屏数据
3.前后端都共用代码，提供开发效率
其中提到了共用代码，即前后端共用一套，如下图，这一具体实现就需要使用同构


####安装依赖
npm install

###开发环境
启动webpack server 
>npm run dev-server
###启动express服务器
>npm run server
###访问服务:3000端口(包含了HMR)

###生产编译
>npm run build

###pm2 管理node进程
###运行Node Server (重启Node Server)  
>npm run start

#文件目录
--- html //静态资源
--- public //开发环境的bundle文件
--- client //客户端部分
	--- index.js //客户端入口文件，渲染React实例
	--- devTools.js //开发工具配置
--- server //服务端部分
	--- Models  //React 服务端渲染逻辑
	--- app.js //服务器主文件
	--- index.js //服务器入口文件
--- common //同构部分
	--- components //组件
	--- actions //Redux action
	--- reducers //Redux reducer
	--- configureStore.js //store生成器
	--- routes.js //router生成器
	--- images //图片
	--- styles  //样式
---webpack
	--- run-webpack-server.js //运行webpack服务的入口文件
	--- webpack-assests.json // webpack-isomorphic-tools生成的静态资源路径文件
	--- webpack-dev-server.js // webpack服务器
	--- webpack-isomorphic-tools.configuration.js //webpack-isomorphic-tools配置文件
	--- webpack-status.json // webpack-isomorphic-tools的日志文件
	--- webpack.config.js //webpack配置文件
	--- webpack.production.js  //打包运行生产环境包
--- .babelrc
--- postcss.config.js  //postcss 样式兼容配置文件
--- package.json
--- README.md
--- process.json   //pm2 执行文件，生产环境执行代码 pm2 管理node 进程 和负载均衡