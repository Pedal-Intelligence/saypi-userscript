const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

const metadata = fs.readFileSync(
  path.resolve(__dirname, "src/metadata.txt"),
  "utf8"
);

module.exports = {
  mode: "development",
  devtool: "inline-source-map", // Add source maps
  entry: "./src/saypi.index.js", // Path to your main userscript file
  output: {
    filename: "saypi.user.js", // The name of the bundled userscript
    path: path.resolve(__dirname, "public"), // Where to put the bundle
  },
  module: {
    rules: [
      {
        test: /\.js$/, // For all .js files
        exclude: /node_modules/, // Except those in node_modules
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(txt|svg)$/i,
        use: "raw-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { sourceMap: true },
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: metadata,
      raw: true, // If true, banner will not be wrapped in a comment
      entryOnly: true, // Add the banner only to the entry chunks
    }),
  ],
};
