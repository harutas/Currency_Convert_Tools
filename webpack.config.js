module.exports = {
  entry: {
    bandle: "./src/index.ts",
  },
  output: {
    path: `${__dirname}/docs`,
    filename: "[name].js",
  },
  mode: "development", //soursemap
  resolve: {
    extensions: [".ts", ".js"], //import時の拡張子省略できる
  },
  devServer: {
    static: {
      directory: `${__dirname}/docs`, // どこをdevServerとして立ち上げるか、どのファイルを見に行くか
    },
    open: true, // ブラウザを自動で開く
  },
  module: {
    rules: [
      {
        test: /\.ts$/, //拡張子が.tsのファイルをコンパイルする
        loader: "ts-loader", // ts-loaderを使ってコンパイルする
      },
    ],
  },
};
