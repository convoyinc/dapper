import * as HtmlPlugin from 'html-webpack-plugin';
import * as _ from 'lodash';
import * as webpack from 'webpack';

// https://webpack.js.org/configuration/entry-context/#entry
export const entry = {
  test: './test/browser/app.tsx',
};

// https://webpack.js.org/configuration/output/
export const output = {
  path: './build',
  // Hot reloading doesn't support [chunkhash].
  filename: 'scripts/[name].js',
  sourceMapFilename: '[file].map',
  publicPath: '/',
  crossOriginLoading: 'anonymous',
};

// https://webpack.js.org/configuration/module/
export const module = {
  rules: [
    {
      test: /\.tsx?$/,
      loader: 'ts-loader',
      // https://github.com/TypeStrong/ts-loader#options
      options: {
        silent: true,
        compilerOptions: {
          // https://github.com/TypeStrong/ts-loader/issues/442
          strictNullChecks: false,
        },
      },
    },
  ],
};

// https://webpack.js.org/configuration/resolve/
export const resolve = {
  extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
};

// https://webpack.js.org/configuration/plugins/
export const plugins = _.compact([

  // https://webpack.js.org/plugins/loader-options-plugin/
  new (webpack as any).LoaderOptionsPlugin({
    minimize: false,
  }),

  // https://webpack.js.org/guides/hmr-react/
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(),

  // https://github.com/ampedandwired/html-webpack-plugin#configuration
  new HtmlPlugin({
    template: './test/browser/index.ejs.html',
    inject: false,
    minify: {
      collapseWhitespace: true,
    },
  }),

]);

// https://webpack.js.org/configuration/dev-server/
export const devServer = {
  hot: true,
  historyApiFallback: true,
  publicPath: '/',
  contentBase: './build',
};

// https://webpack.js.org/configuration/devtool/
export const devtool = 'inline-source-map';
