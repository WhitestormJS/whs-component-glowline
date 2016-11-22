// UTILS
import del from 'del';
import path from 'path';
import express from 'express';
import serveIndex from 'serve-index';
import {argv} from 'yargs';

// GULP
import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';

// WEBPACK & KARMA
import webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';

import {config} from './webpack.config.babel.js';

// SETTINGS
const
  pluginSrc = './src',
  pluginDest = './build',
  examplesDest = 'examples';

const $ = loadPlugins();

// COMPILERS
const isProduction = argv.prod ? true : process.env.NODE_ENV === 'production';

const webpackConfiguration = config({
  isProduction,
  pluginSrc,
  pluginDest
});

const webpackCompiler = webpack(webpackConfiguration);

// ENVIRONMENT  SETUP
process.env.BABEL_ENV = 'node';

gulp.task('default', ['build']);
gulp.task('build', ['build:browser', 'build:node']);

// BUILD: browser
gulp.task('build:browser', ['build:clean'], (callback) => {
  webpackCompiler.run((error, stats) => {
    if (error) throw new $.util.PluginError('webpack', error);
    $.util.log('[webpack]', stats.toString({colors: true}));
  });
});

gulp.task('build:node', (callback) => {
  gulp.src(`${pluginSrc}/**/*`)
    .pipe($.cached('babel', {optimizeMemory: true}))
    .pipe($.babel())
    .on('error', makeBuildErrorHandler('babel'))
    .pipe(gulp.dest('./lib/'));
});

// DEV MODE
gulp.task('dev', () => {
  const server = express();

  server.use(new WebpackDevMiddleware(webpackCompiler, {
    contentBase: examplesDest,
    publicPath: '/build/',

    stats: {colors: true}
  }));

  server.get('*', express.static(path.resolve(__dirname, examplesDest)));
  server.get('*', serveIndex(path.resolve(__dirname, examplesDest), {icons: true}));

  server.get('/whs/whitestorm.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, './node_modules/whs/build/whitestorm.js'));
  });

  server.listen(8080, 'localhost', () => {});
});

// CLEANING
gulp.task('build:clean', (callback) => {
  del([`${pluginDest}/*.js`, `${pluginDest}/*.map`, './lib/**/*.js', './lib/**/*.map', './lib/*']).then(() => callback());
});

// VENDOR
gulp.task('vendor', (callback) => {
  gulp.src('./node_modules/whs/build/whitestorm.js')
    .pipe(gulp.dest('./whs/'));
});

// ERRORS
function makeBuildErrorHandler(taskName) {
  return function ({name, message, codeFrame}) {
    $.util.log(`[${taskName}]`, `${$.util.colors.red(name)} ${message}${codeFrame ? `\n${codeFrame}` : ''}`);
    this.emit('end');
  };
}
