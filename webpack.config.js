const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env = {}) => {
  const {mode = 'development'} = env;
  const isProd = mode === 'production';
  const isDev = mode === 'development';

  const getPlugins = () => {
    const plugins = [
      new HtmlWebpackPlugin({
        template: 'public/index.html'
      }),
      new TSLintPlugin({
        files: ['./src/**/*.ts']
      })
    ];
    if (isProd) {
      plugins.push(new MiniCssExtractPlugin({
        filename: 'main-[hash:8].css',
        minimize: true,
      }))
    }
    return plugins;
  }

  const getStyledLoaders = () => {
    return [
      isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'
    ]
  }

  const getOptimisation = () => {
    const optimisation = {
      mangleWasmImports: true,
      mergeDuplicateChunks: true,
      minimize: false,
    };
    if (isProd) {
      optimisation.minimize = true;
    }
    return optimisation;
  }

  return {
    mode: isProd ? 'production' : isDev && 'development',
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? "main-[hash:8].js" : undefined,
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    devtool: isDev ? 'source-map' : false,
    optimization: getOptimisation(),
    module: {
      rules: [
        {
          test: /\.(js|jsx|tsx|ts)$/,
          exclude: /node_modules/,
          loader: ["babel-loader"]
        },
        {
          enforce: 'pre',
          test: /\.(js)$/,
          exclude: /node_modules/,
          loader: 'source-map-loader'
        },
        {
          test: /\.(css)$/,
          use: getStyledLoaders()
        },
      ]
    },
    plugins: getPlugins(),
    devServer: {
      port: 3000,
      open: true,
    }
  }
}
