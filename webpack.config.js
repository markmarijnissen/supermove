var config = {
	context: __dirname,
    entry: __dirname + "/src/supermove",
    output: {
        path: __dirname + "/dist",
        filename: "supermove.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    }
};

module.exports = config;