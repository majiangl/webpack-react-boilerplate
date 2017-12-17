const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

function getEntries(dir) {
  const entries = {};
  const names = fs.readdirSync(dir);

  for (let name of names) {
    const pathname = path.join(dir, name);

    if (fs.statSync(pathname).isDirectory()) {
      // TODO: remove babelHelpers.js when upgrade to babel 7 and use transform-runtime
      entries[name] = ['./build/babelHelpers.js',path.resolve(pathname, 'index.js')];
    }
  }
  return entries;
}

const jsEntries = getEntries('src/page/');
const htmlWebpackPlugins = Object.keys(jsEntries).map(function (name) {
  let tpl = path.resolve('src/view', name + '.html');
  let config = {
    favicon: 'src/asset/img/favicon.ico',
    template: tpl,
    chunks: ['manifest', 'core', name]
  };
  return new HtmlWebpackPlugin(config);
});

module.exports = {
  entry: jsEntries,
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  // 不同的source map策略选择：https://webpack.js.org/configuration/devtool/
  // 不同的source map效果： https://github.com/webpack/webpack/tree/master/examples/source-map
  //devtool: 'cheap-module-eval-source-map',
  // See served files: http://localhost:8080/webpack-dev-server
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    hot: true
  },
  module: {
    rules: [{
      test: /\.js$/,
      // 排除不需要转码的目录，提高 babel 效率
      exclude: /(node_modules|bower_components|build)/,
      use: {
        loader: 'babel-loader',
        options: {
          // babel-loader 特有配置，缓存 babel 转化结果，提高效率
          cacheDirectory: true
        }
      }
    },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'img/'
          }
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'font/'
          }
        }]
      }
    ]
  },
  plugins: [
    // 清空 dist 目录
    new CleanWebpackPlugin(['dist']),
    // This plugin will cause the relative path of the module to be displayed when HMR is enabled.
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['core', 'manifest']
    })
  ].concat(htmlWebpackPlugins),
  resolve: {
    alias: {
      app: path.resolve(__dirname, 'src')
    }
  }
};
