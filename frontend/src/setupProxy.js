const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {

  app.use(
    '/login',
    createProxyMiddleware({
      target: 'http://localhost:8888',
      changeOrigin: true,
    })
  );
  app.use(
    '/logout',
    createProxyMiddleware({
      target: 'http://localhost:8888',
      changeOrigin: true,
    })
  );
  app.use(
    '/signup',
    createProxyMiddleware({
      target: 'http://localhost:8888',
      changeOrigin: true,
    })
  );
  app.use(
    '/password',
    createProxyMiddleware({
      target: 'http://localhost:8888',
      changeOrigin: true,
    })
  );
  // app.use(
  //   '/upload',
  //   createProxyMiddleware({
  //     target: 'http://localhost:8888',
  //     changeOrigin: true,
  //   })
  // );
  // app.use(
  //   '/pix',
  //   createProxyMiddleware({
  //     target: 'http://localhost:8888',
  //     changeOrigin: true,
  //   })
  // );
  app.use(
    '/beam/api/cmaHPRdl',
    createProxyMiddleware({
      target: 'http://localhost:8888',
      changeOrigin: true,
    })
  );
  app.use(
    '/user/api/newUser',
    createProxyMiddleware({
      target: 'http://localhost:8888/user/api',
      changeOrigin: true,
    })
  );
  app.use(
    '/user/api',
    createProxyMiddleware({
      target: 'http://localhost:8888',
      changeOrigin: true,
    })
  );
  app.use(
    '/termsofuse',
    createProxyMiddleware({
      target: 'http://localhost:8888/',
      changeOrigin: true,
    })
  );
  app.use(
    '/signupsuccess',
    createProxyMiddleware({
      target: 'http://localhost:8888/',
      changeOrigin: true,
    })
  );
  // app.use(
  //   '/u/user',
  //   createProxyMiddleware({
  //     target: 'http://localhost:8888',
  //     changeOrigin: true,
  //   })
  // );
};