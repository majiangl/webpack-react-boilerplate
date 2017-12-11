const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');

function getEntries(dir) {
  const entries = {};
  const names = fs.readdirSync(dir);

  for (let name of names) {
    const pathname = path.join(dir, name);

    if (fs.statSync(pathname).isDirectory()) {
      entries[name] = path.resolve(pathname, 'entry.js');
    }
  }
  return entries;
}

const jsEntries = getEntries('src/app');
const htmlWebpackPlugins = Object.keys(jsEntries).map(function (name) {
  let tpl = path.resolve('src/view', name + '.html');
  let config = {
    favicon: 'src/asset/img/favicon.ico',
    template: tpl,
    chunks: ['manifest', 'core', name],
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
  entry: jsEntries,
  output: {
    filename: 'js/[name]_[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.js$/,
      // 排除不需要转码的目录，提高 babel 效率
      exclude: /(node_modules|bower_components)/,
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
    new UglifyJSPlugin(),
    new ExtractTextPlugin({
      filename: 'css/[name]_[contenthash].css'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['core', 'manifest']
    }),
    // 将 webpack manifest 内联到 html
    new InlineManifestWebpackPlugin()
  ].concat(htmlWebpackPlugins)
};
