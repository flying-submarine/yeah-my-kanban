const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/dda',
    createProxyMiddleware({
      target: 'http://8.219.245.95:5005',
      changeOrigin: true,
      pathRewrite: { '^/dda': '/dda' }, // 可选：如果后端不带 /api 前缀，就移除
    })
  );
};
