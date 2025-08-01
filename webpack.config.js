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

  // Generate popup-config.js content with environment variables
  const popupConfigContent = `/**
 * Auto-generated from ${envFile} - DO NOT MODIFY DIRECTLY
 * This file is regenerated on each build to ensure it uses the correct environment settings.
 * Generated on: ${new Date().toISOString().split('T')[0]}
 */
const config = {
  // Values from ${envFile}
  apiBaseUrl: ${JSON.stringify(envVariables.API_SERVER_URL)},
  authServerUrl: ${JSON.stringify(envVariables.AUTH_SERVER_URL)}
};

// Config is now globally accessible via window.config
// No export needed in popup context
`;

  // Write the content directly to the existing popup-config.js file
  const popupConfigPath = path.resolve(__dirname, "src/popup/popup-config.js");
  fs.writeFileSync(popupConfigPath, popupConfigContent);
  console.log(`Updated src/popup/popup-config.js with values from ${envFile}`);

  return {
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? false : "inline-source-map",
    entry: {
      main: "./src/saypi.index.js",
      background: "./src/svc/background.ts",
      mediaCoordinator: "./src/offscreen/media_coordinator.ts",
      vadHandler: "./src/offscreen/vad_handler.ts",
      audioHandler: "./src/offscreen/audio_handler.ts",
      mediaOffscreen: "./src/offscreen/media_offscreen.ts",
      permissionsPrompt: "./src/permissions/permissions-prompt.ts"
    },
    output: {
      filename: (chunkData) => {
        switch (chunkData.chunk.name) {
          case "main":
            return "saypi.user.js";
          case "background":
            return "background.js";
          case "mediaCoordinator":
            return "offscreen/media_coordinator.js";
          case "vadHandler":
            return "offscreen/vad_handler.js";
          case "audioHandler":
            return "offscreen/audio_handler.js";
          case "mediaOffscreen":
            return "offscreen/media_offscreen.js";
          case "permissionsPrompt":
            return "permissions/permissions-prompt.js";
          default:
            return "[name].bundle.js";
        }
      },
      path: path.resolve(__dirname, "public"),
      publicPath: "",
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
      splitChunks: {
        // Disable code splitting to ensure all code is included in the main bundle
        chunks: 'async',
        cacheGroups: {
          defaultVendors: false,
          default: false
        }
      },
      runtimeChunk: false
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
            from: "node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js",
            to: "[name][ext]",
          },
          {
            from: "node_modules/@ricky0123/vad-web/dist/*.onnx",
            to: "[name][ext]",
          },
          {
            from: "node_modules/@ricky0123/vad-web/node_modules/onnxruntime-web/dist/ort-wasm*.wasm",
            to: "[name][ext]",
          },
          {
            from: "src/permissions/permissions-prompt.html",
            to: "permissions/[name][ext]",
          },
          {
            from: "src/permissions/himfloyd-mic.png",
            to: "permissions/[name][ext]",
          },
          {
            from: "src/permissions/permissions-prompt.css",
            to: "permissions/[name][ext]",
          },
        ],
      }),
    ],
  };
};
