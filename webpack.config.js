const path = require("path");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    lexer: path.resolve(__dirname, "src", "Grammar", "Lexer.ts"),
    postproc: path.resolve(__dirname, "src", "Grammar", "Postprocessors.ts"),
    expression: path.resolve(__dirname, "gen", "Grammar", "Expression.ts"),
    main: path.resolve(__dirname, "src", "Main.ts"),
    treelib: path.resolve(__dirname, "src", "Library", "Trees.ts"),
    iolib: path.resolve(__dirname, "src", "Library", "IO.ts"),
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
    library: {
      type: "var",
      name: "[name]",
    },
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader" },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        extractComments: false,
        terserOptions: {
          compress: false,
          mangle: false,
          format: {
            comments: false
          },
        },
      }),
    ],
  },
};
