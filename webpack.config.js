'use strict';
var WebpackNotifierPlugin = require('webpack-notifier');
var path = require('path');

module.exports = {
    entry: {
        request: "./src/index.js",
        test: "./tests/test.js"
    },

    output: {
        path: "./dist",
        filename: '[name].js'
    },

    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'es6-loader!babel-loader',
            include: [
                path.resolve(__dirname, 'src/')
            ]
        }, {
            test: /\.js$/,
            loader: 'babel-loader!mocha-loader',
            include: [
                path.resolve(__dirname, 'tests/')
            ]
        }]
    },

    plugins: [
        new WebpackNotifierPlugin({
            title: 'Webpack'
        })
    ]
};
