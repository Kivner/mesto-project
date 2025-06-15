// webpack.config.js
const path = require('path');

module.exports = {
    entry: { main: path.resolve(__dirname, './src/scripts/index.js') },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        publicPath: ''
    },
    mode: 'development',
    devServer: {
        static: path.resolve(__dirname, './dist'),
        compress: true,
        port: 8081,

        open: true
    },
}
