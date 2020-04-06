let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './js/main.js',
    output: {
        path : path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
        //publicPath: 'dist/'
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./templates/index.html",
            filename: 'index.html'
        })
    ]

}