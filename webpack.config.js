const path = require('path')
  
const loaders = [
  {
    test: /\.jsx?$/,         // Match both .js and .jsx files
    exclude: /node_modules/,
    loader: 'babel-loader',
  },
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
  }, {
    test: /\.png$/,
    loader: 'url-loader',
    options: {
      limit: 100000
    }
  }, {
    test: /\.jpg$/,
    loader: 'file-loader'
  }, {
    test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url',
    options: {
      limit: 10000,
      mimetype: 'application/font-woff'
    }
  }, {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url',
    options: {
      limit: 10000,
      mimetype: 'application/octet-stream'
    }
  }, {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'file'
  }, {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url',
    options: {
      limit: 10000,
      mimetype: 'image/svg+xml'
    }
  }
]

module.exports = [
{
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, 'build'),       // target dir
    filename: "bundle.js",
    publicPath: "/build/" // path in URL
  },
  module: {
    rules: [...loaders]
  },
  devServer: {
    https: true,
    port: 4000,
    static: {                               
      directory: path.join(__dirname, './'),  
      watch: true
    }
  }
},
{
  entry: "./styleguide.js",
  output: {
    path: path.resolve(__dirname, 'styleguideBuild'),      // target dir
    filename: "styleguideBundle.js",
    publicPath: "/styleguideBuild/" // path in URL
  },
  module: {
    rules: [...loaders]
  }
}]