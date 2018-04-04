const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const util = require('./build/util');

/**
 * 获取js entries
 * @param dir
 * @return {'demo':[build/babelHelpers.js,src/page/demo.js]}
 */
function getEntries() {
  const entries = {};

  util.lookupEntries('src/page', true).forEach(function (item) {
    // TODO: remove babelHelpers.js when upgrade to babel 7 and use transform-runtime
    entries[item.entryname] = ['./build/babelHelpers.js',path.resolve(item.pathname,'index.js')];
  });

  return entries;
}

const htmlWebpackPlugins = util.lookupEntries('src/view').map(function (item) {
  let config = {
    favicon: 'src/asset/img/favicon.ico',
    template: item.pathname,
    chunks: ['manifest', 'core', item.entryname],
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true
            }
          }]
        })
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
    // webpack cache 使用固定的 hashed module id，这样能保证同样的代码打出同样的结果
    new webpack.HashedModuleIdsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new UglifyJSPlugin({
      uglifyOptions: {
        compress: {
          drop_console: true
        }
      }
    }),
    new ExtractTextPlugin({
      filename: 'css/[name]_[contenthash].css'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['core', 'manifest']
    }),
    // 将 webpack manifest 内联到 html
    new InlineManifestWebpackPlugin()
  ].concat(htmlWebpackPlugins),
  resolve: {
    alias: {
      app: path.resolve(__dirname, 'src')
    }
  }
};
