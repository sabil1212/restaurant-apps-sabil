const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/templates/index.html'),
    }),

    new HtmlWebpackPlugin({
      filename: 'showList.html',
      template: path.resolve(__dirname, 'src/templates/showList.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/scripts/manifest.json'),
          to: path.resolve(__dirname, 'dist/manifest.json'),
        },
      ],
    }),
    new WorkboxWebpackPlugin.GenerateSW({
      swDest: './sw.bundle.js',
      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.href.startsWith('https://restaurant-api.dicoding.dev/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24,
            },
          },
        },
        {
          urlPattern: ({ url }) => url.href.startsWith('https://restaurant-api.dicoding.dev/images/medium/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'api-image-cache',
          },
        },
        {
          urlPattern: ({ url }) => url.href.startsWith('https://restaurant-api.dicoding.dev/detail/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'api-detail-cache',
          },
        },
        {
          // eslint-disable-next-line no-restricted-globals
          urlPattern: ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.js'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'js-cache',
          },
        },
        {
          urlPattern: ({ event }) => event.request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'html-cache',
          },
        },
        // Hanya tambahkan aturan runtimeCaching sekali untuk app.bundle.js
        {
          urlPattern: ({ url }) => url.href.startsWith('http://localhost:8080/') && url.href.endsWith('app.bundle.js'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'app-bundle-cache',
          },
        },
        {
          urlPattern: ({ url }) => url.pathname.startsWith('/images/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'image-cache',
          },
        },
      ],
    }),
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
  },
};
