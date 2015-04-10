var webpack = require('webpack');
var argv = require('optimist')
            .alias('m','minify');

var config = {
	context: __dirname,
    entry: __dirname + "/src/supermove",
    output: {
        path: __dirname + "/dist",
        filename: "supermove.js"
    },
    plugins:[
        new webpack.DefinePlugin({
            SUPERMOVE_DEVELOPMENT: !argv.minify,
            VERSION: JSON.stringify(require('./package.json').version)
        })
    ],
    module: {
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    }
};

if(argv.minify){
    delete config.devtool;
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    mangle:true,
    compress:{
      drop_console:false,
      drop_debugger: false
    },
    output: {
      comments: false
    }
  }));
}

module.exports = config;