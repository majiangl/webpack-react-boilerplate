const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const util = require('./build/util');

/**
 * 获取js entries
 * @param dir
 * @return {'demo':['src/page/demo.js']}
 */
function getEntries() {
  const entries = {};

  util.filterEntries(util.lookupEntries('src/app/page', true), process.env.ENTRY_FILTER).forEach(function (item) {
    entries[item.entryname] = path.resolve(item.pathname, 'index.js');
  });

  return entries;
}

const htmlWebpackPlugins = util.filterEntries(util.lookupEntries('src/template'), process.env.ENTRY_FILTER).map(function (item) {
  let config = {
    favicon: 'src/asset/img/favicon.ico',
    template: item.pathname,
    chunks: ['runtime', 'vendors', 'core', item.entryname]
  };
  return new HtmlWebpackPlugin(config);
});

module.exports = {
  entry: getEntries(),
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  // 不同的source map策略选择：https://webpack.js.org/configuration/devtool/
  // 不同的source map效果： https://github.com/webpack/webpack/tree/master/examples/source-map
  devtool: 'cheap-module-eval-source-map',
  // See served files: http://localhost:8080/webpack-dev-server
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    hot: true
  },
  mode: 'development',
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10
        },
        default: {
          name: 'core',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
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
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
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
  ].concat(htmlWebpackPlugins),
  resolve: {
    alias: {
      app: path.resolve(__dirname, 'src/app')
    }
  }
};
