var webpack = require('webpack');
var argv = require('optimist')
            .alias('m','minify')
            .argv;

var filename = argv.minify? 'supermove.min.js':'supermove.js';

var config = {
	context: __dirname,
    entry: {
      "supermove":__dirname + "/src/supermove",
      "supermove.button": __dirname + "/src/behaviors/button"
    },
    output: {
        path: __dirname + "/dist",
        filename: argv.minify? "[name].min.js":"[name].js"
    },
    plugins:[
        new webpack.DefinePlugin({
            SUPERMOVE_DEVELOPMENT: !argv.minify,
            VERSION: JSON.stringify(require('./package.json').version)
        }),
        new webpack.optimize.CommonsChunkPlugin("supermove",filename)
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
      drop_console:true,
      drop_debugger: true
    },
    output: {
      comments: false
    }
  }));
}

module.exports = config;