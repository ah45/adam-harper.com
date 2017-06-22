exports.modifyWebpackConfig = function (config, state) {
  config.loader('pug', {
    test: /\.(pug|jade)$/,
    loader: 'pug-loader'
  })

  return config
}
