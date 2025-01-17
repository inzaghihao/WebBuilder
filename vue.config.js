let config = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    outputDir: './src/web/dist',
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "@/web/styles/color/black-purple.scss";`,
            },
        },
    },
}
//
if (process.argv[2] === 'build') {
    const path = process.argv[3]
    const name = process.argv[3].split('\\').reverse()[1]
    config['pages'] = {}
    config['pages'][name] = {
        entry: path, // Webpack 打包入口
        template: `src/public/index.html`, // Html-webpack-plugin 插件的模板来源
        filename: `${name}.html`, // 在 dist/index.html 的输出
        chunks: ['chunk-vendors', 'chunk-common', name], // 提取出来的通用 chunk 和 vendor chunk。
    }
}
module.exports = config
