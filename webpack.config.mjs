import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import Dotenv from "dotenv-webpack";
import { fileURLToPath } from "url";

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "production", // ✅ Ensure it's set correctly
  entry: "./src/index.tsx", // ✅ Entry point for React
  output: {
    path: path.resolve(__dirname, "dist"), // ✅ Webpack output location
    filename: "bundle.js",
    publicPath: "/",
    clean: true, // ✅ Ensures old files are removed
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"), // ✅ Ensure this file exists
      inject: "body",
      filename: "index.html",
    }),
    new Dotenv(),
  ],
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3000,
    historyApiFallback: true,
    host: "0.0.0.0",
    allowedHosts: "all",
  },
};
