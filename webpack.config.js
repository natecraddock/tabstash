const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        popup: "./src/popup.ts",
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
        path: path.resolve(__dirname, 'build'),
    },
    optimization: {
        minimize: false
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
           patterns: [
               {
                   context: path.resolve(__dirname, "src"),
                   from: "**/*",
                   globOptions: {
                       ignore: ["**/*.ts"]
                   }
               }
           ]
        })
    ]
};
