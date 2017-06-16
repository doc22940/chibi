var path = require('path');
var fs = require('fs');
var webpack = require('webpack');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractHTML = new ExtractTextPlugin('index.html');
var extractCSS = new ExtractTextPlugin('style.css');

var config = {
  devServer: {
    port: 8000,
    historyApiFallback: true,
  },

  resolve: {
    modules: [path.resolve(__dirname, 'scripts'), path.resolve(__dirname, 'node_modules')],
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      assets: path.resolve(__dirname, 'assets/'),
      config$: 'config/' + (process.env.NODE_ENV || 'default') + '.js',
    },
  },

  entry: {
    'script': path.resolve(__dirname, 'scripts/index.jsx'),
    'style': path.resolve(__dirname, 'styles/index.scss'),
    'index': path.resolve(__dirname, 'index.html'),
  },

  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        use: extractHTML.extract({
          use: ['html-loader?attrs=link:href'],
        }),
      },
      {
        test: /\.scss$/,
        use: extractCSS.extract({
          use: ['css-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          use: ['css-loader'],
        }),
      },
      {
        test: /\.jsx$/,
        use: ['babel-loader'],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)\//,
        use: ['babel-loader'],
      },
      {
        test: /\.json$/,
        use: ['json-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg.*)$/,
        use: [{
          loader: 'file-loader',
          query: {useRelativePath: false},
        }, 'img-loader'],
      },
      {
        test: /\.(ttf.*|eot.*|woff.*|ogg|mp3)$/,
        use: [{
          loader: 'file-loader',
          query: {useRelativePath: false},
        }],
      },
    ],
  },

  plugins: [
    extractHTML,
    extractCSS,
    new webpack.DefinePlugin({
      Environment: JSON.stringify({
        hairs: {
          male: fs.readdirSync('assets/images/creator/hair/male').map(f => f.split('.')[0]),
          female: fs.readdirSync('assets/images/creator/hair/female').map(f => f.split('.')[0]),
        },
        hairFronts: {
          male: fs.readdirSync('assets/images/creator/hair-front/male').map(f => f.split('.')[0]),
          female: fs.readdirSync('assets/images/creator/hair-front/female').map(f => f.split('.')[0]),
        },
        hairBacks: {
          male: fs.readdirSync('assets/images/creator/hair-back/male').map(f => f.split('.')[0]),
          female: fs.readdirSync('assets/images/creator/hair-back/female').map(f => f.split('.')[0]),
        },
      }),
    }),
  ],
};

if (process.env.NODE_ENV !== 'production') {
  config['devtool'] = 'source-map';
}

module.exports = config;
