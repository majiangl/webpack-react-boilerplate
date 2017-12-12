const webpack = require('webpack');
const config = require('../webpack.config.prod');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Lookup plugin config: https://github.com/webpack-contrib/webpack-bundle-analyzer
config.plugins.push(new BundleAnalyzerPlugin());
config.profile = true;

const compiler = webpack(config);

compiler.run(function (err, stats) {
  if (err) {
    throw err;
  }
  console.log(stats.toString({
    colors: true
  }));
});
