var webpack = require('webpack');
var argv = require('optimist')
            .alias('m','minify')
            .alias('l','lib')
            .argv;

// include libraries or not?
var alias;
if(argv.lib) {
  alias = {
    'mithril': __dirname + '/lib/mithril'
  };
} else {
  alias = {
    'mithril':__dirname + '/lib/external-mithril',
    'kefir':__dirname + '/lib/external-kefir'
  };
}

var config = {
	context: __dirname,
    entry: {
      "supermove":__dirname + "/supermove"
    },
    resolve:{
      alias: alias
    },
    output: {
        path: __dirname + "/build",
        filename: filename('[name]')
    },
    plugins:[
        new webpack.DefinePlugin({
            SUPERMOVE_DEVELOPMENT: !argv.minify,
            VERSION: JSON.stringify(require('./package.json').version)
        }),
        //new webpack.optimize.CommonsChunkPlugin("supermove",filename('supermove'))
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

function filename(name){
  if(argv.lib) name += '.lib';
  if(argv.m) name += '.min';
  return name + '.js';
}

module.exports = config;