const context = __dirname + '/src';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: context + '/js/index.js',
    output: {
        path: __dirname + "/dist",
        filename: './js/[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                loader: 'pug-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader",
                        options: { sourceMap: true }
                    },
                    {
                        loader: "postcss-loader",
                        options: { sourceMap: true }
                    },
                    {
                        loader: "resolve-url-loader"
                    },
                    {
                        loader: "sass-loader",
                        options: { sourceMap: true }
                    }
                ],
            },
            {   test: /\.js/,
                    exclude: /node_modules/,
                    loader: "babel-loader"
            },
            {
                test: /.(jpg|jpeg|png|svg)$/,
                type: "asset/inline"
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf)$/,
                type: "asset/inline"
            }
        ]
    },
    devServer: {
        contentBase: '/dist',
        open: 'chrome',
        compress: true,
        hot: true,
        port: 3000
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `css/styles.min.css`
        }),
        new HtmlWebpackPlugin({
            template: './src/index.pug',
            minify: false,
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "./src/assets/img",
                    to: "assets/img",
                    noErrorOnMissing: true
                },
                {
                    from: "./src/assets/fonts",
                    to: "assets/fonts",
                    noErrorOnMissing: true
                }
            ]
        }),
    ]
}
