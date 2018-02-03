let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin'); // 支援樣板
let ExtractTextPlugin = require('extract-text-webpack-plugin'); //處理css 之類的
let UglifyJsPlugin = require('uglifyjs-webpack-plugin') // 壓縮 & 混淆
let WriteFilePlugin = require('write-file-webpack-plugin'); // npm start + 輸出目錄
let OpenBrowserPlugin = require('open-browser-webpack-plugin'); // 自動開啟瀏覽器
let CopyWebpackPlugin = require('copy-webpack-plugin'); // 直接複製目錄檔案
let CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin; // 緩存加速ts 編譯
let basePath = __dirname;

module.exports = {
  // target: 'electron-renderer', // 給electron用  目前失敗！？請執行 toElectron.sh
  context: path.join(basePath, 'src'), // src目錄
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx', '.scss'], //支持的擴充名,需要 rules loader 配合
  },
  entry: { // 進入點 使 index.html載入 
    app: [ // 匯出後js 名稱
      'react-hot-loader/patch',
      './index.jsx',
    ],
    // electronMain:[
    //   './electronMain.js'
    // ],
    // vendor: [ // 外部資源
    //   'react',
    //   'react-dom',
    // ],
    vendorStyles: [ // 外部資源
      '../node_modules/bootstrap/dist/css/bootstrap.css',
    ],
  },
  output: { // 輸出目錄和名稱規則
    path: path.join(basePath, 'docs'), // 匯出目錄 docs
    filename: '[name].js', // [name] 來自 entry
  },
  module: {
    rules: [ //規則
      {
        test: /^manifest.js$/,
        loader: 'file-loader',
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/, //不要去爬 node_modules
        loader: 'awesome-typescript-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({ // 還不是很了解 ExtractTextPlugin.extract 怎麼用,複製貼上就是
          fallback: 'style-loader',
          use: [{
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[local]',
                camelCase: true,
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        }),
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
          },
        }),
      },
      // Loading glyphicons => https://github.com/gowravshekar/bootstrap-webpack
      // Using here url-loader and file-loader
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /\.(png|jpg|jpe?g|gif)$/,
        exclude: /node_modules/,
        loader: 'url-loader?limit=5000',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
  // For development https://webpack.js.org/configuration/devtool/#for-development
  // devtool: 'inline-source-map', //老實說不知道怎麼用它
  devServer: {
    port: 8080,
    hot: true,
  },
  plugins: [
    new UglifyJsPlugin({ // 壓縮混淆
      uglifyOptions: {
        compress: true,
        warnings: true,
      }  
    }),
    //Generate index.html in /docs => https://github.com/ampedandwired/html-webpack-plugin
    new WriteFilePlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html', //Name of file in ./docs/
      template: 'index.html', //Name of template in ./src
      hash: true,
    }),
    // new webpack.optimize.CommonsChunkPlugin({ // 還不是很清楚作用
    //   names: ['vendor', 'manifest'],
    // }),
    new webpack.HashedModuleIdsPlugin(),
    new ExtractTextPlugin({
      filename: '[name].css',
      disable: true,
      allChunks: true,
    }),
    new CheckerPlugin(), // 緩存加速ts 編譯
    new webpack.HotModuleReplacementPlugin(), // 熱修改 使[chunkhash]. 省略
    new webpack.DefinePlugin({
      "process.env": { 
        NODE_ENV: JSON.stringify("production") 
      },
      'ENV': JSON.stringify('production')
    }),
    new OpenBrowserPlugin({ // 自動開啟瀏覽器
      url: 'http://localhost:8080'
    }),
  ],
};
