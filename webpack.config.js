import fs from "fs";
import path from "path";
import webpack from "webpack";
import dotenv from "dotenv";
import CopyPlugin from "copy-webpack-plugin";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const metadata = fs.readFileSync(
  path.resolve(__dirname, "src/metadata.txt"),
  "utf8"
);

export default (env, argv) => {
  // Determine if it's production mode
  const isProduction = argv.mode === "production";

  // Use the dotenv package to load environment variables from .env or .env.production file
  const envFile = isProduction ? ".env.production" : ".env";
  const envVariables = dotenv.config({ path: envFile }).parsed;

  // Reduce it to a nice object
  const envKeys = Object.keys(envVariables).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(envVariables[next]);
    return prev;
  }, {});

  return {
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? "source-map" : "inline-source-map",
    entry: {
      main: "./src/saypi.index.js",
    },
    output: {
      filename: (chunkData) => {
        return chunkData.chunk.name === "main"
          ? "saypi.user.js"
          : "[name].bundle.js";
      },
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
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /audioModule\.bundle\.js$/,
          use: "raw-loader",
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    optimization: {
      minimize: false, // Prevents minification in production mode
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: metadata,
        raw: true,
        entryOnly: true,
      }),
      new webpack.DefinePlugin(envKeys), // Inject environment variables
      new CopyPlugin({
        patterns: [
          {
            from: "node_modules/@jcrawley_dev/firevad/dist/vad.worklet.bundle.min.js",
            to: "[name][ext]",
          },
          {
            from: "node_modules/@jcrawley_dev/firevad/dist/*.onnx",
            to: "[name][ext]",
          },
          {
            from: "node_modules/onnxruntime-web/dist/*.wasm",
            to: "[name][ext]",
          },
        ],
      }),
    ],
  };
};
