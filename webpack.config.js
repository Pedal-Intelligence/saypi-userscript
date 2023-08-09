const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map', // Add source maps
    entry: './src/saypi.index.js', // Path to your main userscript file
    output: {
        filename: 'saypi.user.js', // The name of the bundled userscript
        path: path.resolve(__dirname, 'public'), // Where to put the bundle
    },
    module: {
        rules: [
            {
                test: /\.js$/, // For all .js files
                exclude: /node_modules/, // Except those in node_modules
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.txt$/i,
                use: 'raw-loader',
            },
        ],
    },
};
