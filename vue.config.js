module.exports = {
  devServer: {
    proxy: {
      '/rpc': {
        target: 'http://127.0.0.1:9100',
        changeOrigin: true,
        pathRewrite: {
          '^/rpc': '/rpc'
        }
      }
    },
  }
};
