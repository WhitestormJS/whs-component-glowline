import path from 'path';
import webpack from 'webpack';

process.env.BABEL_ENV = 'browser';

export function config({isProduction, pluginSrc, pluginDest}) {
  if (process.env.CI) isProduction = true;
  console.log(isProduction ? 'Production mode' : 'Development mode');
  const _version = require('./package.json').version;
  console.log(_version);

  const bannerText = `WHS.GlowLine v${_version}`;

  return {
    devtool: isProduction ? false : 'source-map',
    entry: `${pluginSrc}/index.js`,
    target: 'web',
    output: {
      path: path.join(__dirname, pluginDest),
      filename: 'whs-component-glowline.js',
      library: ['WHS', 'GlowLine'],
      libraryTarget: 'umd'
    },
    externals: {
      whs: 'WHS',
      three: 'THREE',
      'whs/physics/index': 'Physijs'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          happy: { id: 'js' }
        }
      ]
    },
    plugins: isProduction
    ? [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        minimize: true
      }),
      new webpack.BannerPlugin(bannerText),
    ]
    : [new webpack.BannerPlugin(bannerText)]
  };
}
