const { merge } = require("webpack-merge");
const common = require("./webpack.config.common.js");

module.exports = (env = {}) => {
  return merge(common, {
    mode: "development",
    devtool: "eval-source-map",
    output: {
      publicPath: env.WEBPACK_SERVE ? "/" : "./",
    },
    entry: ["./src/Script/game.ts"],

    devServer: {
      host: "localhost",
      port: 10001,
      static: {
        directory: "./dist",
      },
      hot: false,
      open: true,
      server: {
        type: "http",
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  });
};
