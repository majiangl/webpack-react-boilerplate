const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const util = require('./build/util');

/**
 * 获取js entries
 * @param dir
 * @return {'demo':[build/babelHelpers.js,src/page/demo.js]}
 */
function getEntries() {
  const entries = {};

  util.lookupEntries('src/page', true).forEach(function (item) {
    entries[item.entryname] = path.resolve(item.pathname, 'index.js');
  });

  return entries;
}

const htmlWebpackPlugins = util.lookupEntries('src/view').map(function (item) {
  let config = {
    favicon: 'src/asset/img/favicon.ico',
    template: item.pathname,
    chunks: ['runtime', 'vendors', 'core', item.entryname],
    minify: {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true
    }
  };
  return new HtmlWebpackPlugin(config);
});

module.exports = {
  entry: getEntries(),
  output: {
    filename: 'js/[name]_[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  mode: 'production',
  optimization: {
    // webpack cache 使用固定的 hashed module id，这样能保证同样的代码打出同样的结果
    moduleIds: 'hashed',
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
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
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'img/',
            limit: '1024'
          }
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'font/'
          }
        }]
      }
    ]
  },
  plugins: [
    // 清空 dist 目录
    new CleanWebpackPlugin(['dist']),
    new MiniCssExtractPlugin({
      filename: "css/[name]_[contenthash].css"
    })
  ].concat(htmlWebpackPlugins).concat([
    // this plugin need to put after HtmlWebpackPlugin
    new InlineManifestWebpackPlugin()
  ]),
  resolve: {
    alias: {
      app: path.resolve(__dirname, 'src')
    }
  }
};
