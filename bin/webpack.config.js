
const path = require('path');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const config = {
  entry: {
    app: './src/app/main.ts'
  },
  module: "esnext",
  mode: "development",
  output: {
    filename: 'main.js',
    module: true,
    path: path.resolve(process.cwd(), 'dist/app')
  },
  experiments: {
      outputModule: true
  },
  devtool: 'source-map',
  resolve: {
      // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
      extensions: ['.ts'],
      plugins: [new TsConfigPathsPlugin({
          configFile: path.resolve(process.cwd(), "./tsconfig.json")
      })]
  },
  module: {
      rules: [
          {
              test: /\.ts$/,
              use: [
                  {
                      loader: 'ts-loader',
                      options: {
                          configFile: path.resolve(process.cwd(), "./tsconfig.json")
                      }
                  }
              ]
          }
      ]
  }
};

module.exports = config;