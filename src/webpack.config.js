const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const toml = require('toml');
const yaml = require('yamljs');
const json5 = require('json5');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    // print: './src/print.js',
    litegraph_editor: './src/litegraph_editor.js',
    // excel: './src/excel.js',
    grapheditor: './src/grapheditor.js',
    three3d: './src/three3d.js'
  },

  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  plugins: [
    new MonacoWebpackPlugin(),

    new HtmlWebpackPlugin({
      title: 'Development',
    }),
  ],
  output: {
    // filename: 'bundle.js',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  optimization: {
    runtimeChunk: 'single',
  }, 
 
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }, {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }, {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: "imgs/[name][ext]"
        }
      }, {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader'],
      },
      {
        test: /\.xml$/i,
        use: ['xml-loader'],
      }, {
        test: /\.toml$/i,
        type: 'json',
        parser: {
          parse: toml.parse,
        },
      },
      {
        test: /\.yaml$/i,
        type: 'json',
        parser: {
          parse: yaml.parse,
        },
      },
      {
        test: /\.json5$/i,
        type: 'json',
        parser: {
          parse: json5.parse,
        },
      },
    ],
  },
};