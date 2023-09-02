const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");

const metadata = fs.readFileSync(
  path.resolve(__dirname, "src/metadata.txt"),
  "utf8"
);

module.exports = (env) => {
  // Use the dotenv package to load environment variables from .env or .env.production file
  const envFile = env && env.production ? ".env.production" : ".env";
  const envVariables = dotenv.config({ path: envFile }).parsed;

  // Reduce it to a nice object
  const envKeys = Object.keys(envVariables).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(envVariables[next]);
    return prev;
  }, {});

  return {
    mode: "development",
    devtool: "inline-source-map",
    entry: "./src/saypi.index.js",
    output: {
      filename: "saypi.user.js",
      path: path.resolve(__dirname, "public"),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
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
        raw: true,
        entryOnly: true,
      }),
      new webpack.DefinePlugin(envKeys), // Inject environment variables
    ],
  };
};
