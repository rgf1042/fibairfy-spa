module.exports = {
  runtimeCompiler: true,
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      definitions[0]['fiberfy.constants'] = {}
      definitions[0]['fiberfy.constants']['BASE_URL'] = JSON.stringify('http://localhost:1337')
      definitions[0]['fiberfy.constants']['API_VERSION'] = JSON.stringify('/api/v1')
      definitions[0]['fiberfy.constants']['PROJECT_DEFAULT_NAME'] = JSON.stringify('default')
      definitions[0]['fiberfy.constants']['PROJECT_DEFAULT_LATITUDE'] = JSON.stringify('41.66060124302088')
      definitions[0]['fiberfy.constants']['PROJECT_DEFAULT_LONGITUDE'] = JSON.stringify('1.571044921875')
      definitions[0]['fiberfy.constants']['PROJECT_DEFAULT_ZOOM'] = JSON.stringify('8')
      return definitions;
    });
  }
  /*configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'fiberfy.constants': {
          'BASE_URL': JSON.stringify('http://localhost:1337'),
          'API_VERSION': JSON.stringify('/api/v1'),
          'PROJECT_DEFAULT_NAME': JSON.stringify('default'),
          'PROJECT_DEFAULT_LATITUDE': JSON.stringify('41.66060124302088'),
          'PROJECT_DEFAULT_LONGITUDE': JSON.stringify('1.571044921875'),
          'PROJECT_DEFAULT_ZOOM': JSON.stringify('8')
        }
      })
    ]
  }*/
}