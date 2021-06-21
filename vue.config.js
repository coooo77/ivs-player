module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /[/\\]amazon-ivs-player[/\\].*dist[/\\]assets[/\\]/,
          loader: 'file-loader',
          type: 'javascript/auto',
          options: {
            name: '[name].[ext]'
          }
        }
      ]
    }
  }
}
