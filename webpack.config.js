var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './app/index.jsx',
    output: {
        path: __dirname,
        filename: './public/bundle.js'
    },
    resolve: {
        root: __dirname,
        alias: {},
        extensions: ['.js', '.jsx', '']
    },
    module: {
        loaders: [{
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015', 'stage-0']
            },
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/
        }, {
            test: /\.css$/,
            // include: /node_modules/,
            loaders: ['style-loader', 'css-loader'],
        }, { test: /\.(eot|woff)$/, loader: "file-loader" }]
    },
    plugins: [
        // new webpack.DefinePlugin({ // <-- key to reducing React's size
        //     'process.env': {
        //         'NODE_ENV': JSON.stringify('production')
        //     }
        // }),
        // new webpack.optimize.DedupePlugin(), //dedupe similar code 
        // new webpack.optimize.UglifyJsPlugin(), //minify everything

        // new webpack.NoErrorsPlugin(),
        // new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
        // new webpack.optimize.OccurrenceOrderPlugin(),
        // new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         screw_ie8: true,
        //         warnings: false
        //     },
        //     mangle: {
        //         screw_ie8: true
        //     },
        //     output: {
        //         comments: false,
        //         screw_ie8: true
        //     }
        // })
    ],
    devServer: {
        historyApiFallback: true,
    },
  watchOptions: {
      poll: true,
      ignored: /node_modules/

  }
};
