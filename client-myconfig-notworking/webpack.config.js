let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/index.js',
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
            },
            {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' }
            },
            {
                test: /\.html$/,
                use: [
                  {
                    loader: "html-loader"
                  }
                ]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: 'index.html'
        })
    ]

}