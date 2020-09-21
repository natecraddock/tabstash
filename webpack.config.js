const path = require("path");

module.exports = {
    // entry: "./src/popup.ts",
    entry: {
        popup: "./src/popup.ts",
        stash: "./src/stash.ts",
        tabstash: "./src/tabstash.ts"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: false
    }
};
