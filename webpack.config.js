module.exports = {
    entry: "./public/js/main.js",
    output: {
        path: __dirname,
        filename: "./public/js/bundle.js"
    },
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }]
    }
};
