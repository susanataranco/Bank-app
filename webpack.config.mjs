import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack"; 
import Dotenv from "dotenv-webpack";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "production",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "frontend-dist"), 
    filename: "[name].[contenthash].js", 
    publicPath: "./", 
    clean: true,
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
      template: path.resolve(__dirname, "public/index.html"),
      inject: "body",
      filename: "index.html",
    }),
    new Dotenv(),
    new webpack.DefinePlugin({
      "process.env.NEXT_PUBLIC_BACKEND_API_URL": JSON.stringify(process.env.NEXT_PUBLIC_BACKEND_API_URL),
    }),
  ],
  devServer: {
    static: path.join(__dirname, "frontend-dist"),
    port: 3000,
    historyApiFallback: true, 
    host: "0.0.0.0",
    allowedHosts: "all",
  },
};
