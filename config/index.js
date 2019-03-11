const path = require('path');

module.exports = {
  dev: {
    host: 'localhost',
    port: 8080,
    // host: 'localhost',
    // port: 8080,
    proxyTable: {
      '/eps': {
        target: 'http://inteps.51ebill.com',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/eps': '/eps'
        }
      }
    },
    useEslint: true,
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    showEslintErrorsInOverlay: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    devtool: 'cheap-module-eval-source-map',
    poll: false,
    cacheBusting: true,
    cssSourceMap: true
  },
  build: {
    bundleAnalyzerReport: false,
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    devtool: '#source-map',
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
  }
};
