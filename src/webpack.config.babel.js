// webpack.config.js
// webpack.config.js

// Determine if we are in a CommonJS environment
const isRequireEnv = typeof require !== 'undefined' && typeof module !== 'undefined';

// Conditionally load Node modules
const path = isRequireEnv ? require('path') : await import('path').then(m => m.default || m);
const fs = isRequireEnv ? require('fs') : await import('fs').then(m => m.default || m);

// Conditionally load other modules
const packageData = isRequireEnv
  ? require('./license.config.js')
  : (await import('./license.config.js')).default;

const TerserPlugin = isRequireEnv
  ? require('terser-webpack-plugin')
  : (await import('terser-webpack-plugin')).default;

// Plugin to add license after minification
class AddLicenseAfterTerserPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('AddLicenseAfterTerserPlugin', (compilation) => {
      const outputPath = this.options.outputPath || compiler.options.output.path;
      const outputFileName = this.options.outputFileName || compiler.options.output.filename;
      const outputFilePath = path.join(outputPath, outputFileName);

      fs.readFile(outputFilePath, 'utf8', (err, data) => {
        if (err) throw err;
        const licenseText = `${packageData.LICENSE} `;
        const newContent = licenseText + data;

        fs.writeFile(outputFilePath, newContent, 'utf8', (err) => {
          if (err) throw err;
          console.log(`License added to ${outputFileName}`);
        });
      });
    });
  }
}

// Plugin to remove LICENSE.txt from emitted assets
class RemoveLicenseFilePlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('RemoveLicenseFilePlugin', (compilation) => {
      for (const name in compilation.assets) {
        if (name.endsWith('LICENSE.txt')) {
          delete compilation.assets[name];
        }
      }
    });
  }
}

// Export Webpack config (async to support ES module conditional imports)
export default async () => ({
  entry: `./src/${packageData.FILENAME}.js`,
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: packageData.main.split('/').pop(),
    library: { type: 'module' },
  },
  experiments: { outputModule: true },
  optimization: {
    minimizer: [new TerserPlugin({ extractComments: false })],
  },
  plugins: [new RemoveLicenseFilePlugin(), new AddLicenseAfterTerserPlugin()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] },
        },
      },
    ],
  },
  resolve: { extensions: ['.js'] },
  externals: { ace: 'ace' },
});

