/**
 * Created by niwei on 2018/1/18.
 *
 * 这是同构的配置文件，即核心文件，一般情况下不需要修改，直接用即可，只提其中的一句
 * 为什么要用webpack-isomorphic-tools
 webpack可以将任意资源打包，那是在客户端，但是当其运行在服务端时，对于非js文件是无法正常import的，这里我的处理办法是webpack-isomorphic-tools
 */
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

module.exports =
    {
        webpack_assets_file_path: 'webpack/webpack-assets.json',
        webpack_stats_file_path: 'webpack/webpack-stats.json',
        assets:
            {
                images:
                    {
                        extensions: ['png', 'jpg', 'gif', 'ico', 'svg']
                    },
                style_modules: {
                    extensions: ['scss','css'],
                    filter: function(module, regex, options, log) {
                        if (options.development) {
                            // in development mode there's webpack "style-loader",
                            // so the module.name is not equal to module.name
                            return WebpackIsomorphicToolsPlugin.style_loader_filter(module, regex, options, log);
                        } else {
                            // in production mode there's no webpack "style-loader",
                            // so the module.name will be equal to the asset path
                            return regex.test(module.name);
                        }
                    },
                    path: function(module, options, log) {
                        if (options.development) {
                            // in development mode there's webpack "style-loader",
                            // so the module.name is not equal to module.name
                            return WebpackIsomorphicToolsPlugin.style_loader_path_extractor(module, options, log);
                        } else {
                            // in production mode there's no webpack "style-loader",
                            // so the module.name will be equal to the asset path
                            return module.name;
                        }
                    },
                    parser: function(module, options, log) {
                        if (options.development) {
                            return WebpackIsomorphicToolsPlugin.css_modules_loader_parser(module, options, log);
                        } else {
                            // in production mode there's Extract Text Loader which extracts CSS text away
                            return module.source;
                        }
                    }
                }
            }
    }