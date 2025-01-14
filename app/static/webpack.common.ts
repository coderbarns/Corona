// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as path from 'path';
import * as fs from 'fs';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import MomentLocalesPlugin from 'moment-locales-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

function resolve(dir) {
  return path.join(__dirname, dir);
}

const TSX_PATTERN = /\.ts|\.tsx$/;
const JSX_PATTERN = /\.jsx?$/;
const CSS_PATTERN = /\.(sa|sc|c)ss$/;
const IMAGE_PATTERN = /\.(png|svg|jpg|gif)$/;
const VENDORS_PATTERN = /[\\/]node_modules[\\/](react|react-dom)[\\/]/;
const FONT_PATTERN = /\.(ttf|woff2|otf)$/;
const RESOLVED_EXTENSIONS = ['.tsx', '.ts', '.js', '.jsx', '.css', '.scss'];

const PATHS = {
  components: resolve('/js/components'),
  config: resolve('/js/config'),
  dist: resolve('/dist'),
  ducks: resolve('/js/ducks'),
  lib: resolve('/js/lib'),
  interfaces: resolve('/js/interfaces'),
  pages: resolve('/js/pages'),
  providers: resolve('/js/providers'),
  utils: resolve('/js/utils'),
  css: resolve('/css/'),
};

// Process of Templates
const walkSync = (dir: string, filelist: string[] = []) => {
  fs.readdirSync(dir).forEach((file) => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
};
const templatesList = walkSync('templates');
const htmlWebpackPluginConfig = templatesList.map((file) => {
  return new HtmlWebpackPlugin({
    filename: file,
    template: file,
    inject: false,
  });
});

const config: webpack.Configuration = {
  entry: {
    main: [resolve('/css/styles.scss'), resolve('/js/index.tsx')],
  },
  output: {
    publicPath: '/static/dist/',
    path: PATHS.dist,
    filename: '[name].[contenthash].js',
  },
  devtool: 'source-map',
  resolve: {
    alias: {
      pages: PATHS.pages,
      components: PATHS.components,
      config: PATHS.config,
      ducks: PATHS.ducks,
      lib: PATHS.lib,
      interfaces: PATHS.interfaces,
      providers: PATHS.providers,
      utils: PATHS.utils,
    },
    extensions: RESOLVED_EXTENSIONS,
  },
  module: {
    rules: [
      {
        test: TSX_PATTERN,
        loader: 'ts-loader',
      },
      {
        test: JSX_PATTERN,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: CSS_PATTERN,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [PATHS.css],
              },
            },
          },
        ],
      },
      {
        test: IMAGE_PATTERN,
        use: 'file-loader',
      },
      {
        test: FONT_PATTERN,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MomentLocalesPlugin(), // To strip all locales except “en”
    ...htmlWebpackPluginConfig,
  ],
  optimization: {
    moduleIds: 'hashed',
    splitChunks: {
      cacheGroups: {
        default: false,
        major: {
          name: 'vendors',
          test: VENDORS_PATTERN,
          chunks: 'all',
        },
      },
    },
  },
};
export default config;
