'use strict';
var WebpackNotifierPlugin = require('webpack-notifier');
var path = require('path');

function getEntryPoint() {
    if (process.env.ENTRY == 'test') {
        return {};
    } else {
        return {
            request: "./src/request.js"
        };
    }
}
module.exports = {
    entry: getEntryPoint(),
    devtool: 'source-map',
    output: {
        path: "./dist",
        filename: '[name].js'
    },

    module: {
        loaders: [{
            test: /\.js/,
            loader: 'es6-loader!babel-loader',
            exclude: /node_modules/
        }]
    },

    plugins: [
        new WebpackNotifierPlugin({
            title: 'Webpack'
        })
    ]
};
