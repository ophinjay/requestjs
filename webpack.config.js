'use strict';
var WebpackNotifierPlugin = require('webpack-notifier');
var path = require('path');

module.exports = {
    entry: {
        request: "./src/index.js"
    },

    output: {
        path: "./dist",
        filename: '[name].js'
    },

    module: {
        loaders: [{
            test: /\.js$/,
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
