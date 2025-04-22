const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/chatMuti',
    createProxyMiddleware({
      target: 'http://121.41.84.236:8080',
      changeOrigin: true,
    })
  );
};
