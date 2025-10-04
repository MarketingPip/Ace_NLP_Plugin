// webpack.config.js
// Supports both require (CJS) and import (ESM) environments

async function getWebpackConfig() {
  const isRequireEnv = typeof require !== 'undefined' && typeof module !== 'undefined';

  // Conditionally load path and fs
  const path = isRequireEnv ? require('path') : (await import('path')).default;
  const fs = isRequireEnv ? require('fs') : (await import('fs')).default;

  // Conditionally load TerserPlugin and license config
  const TerserPlugin = isRequireEnv
    ? require('terser-webpack-plugin')
    : (await import('terser-webpack-plugin')).default;

  const packageData = isRequireEnv
    ? require('./license.config.js')
    : (await import('./license.config.js')).default;

  // Plugin to add license after minification
  class AddLicenseAfterTerserPlugin {
    constructor(options = {}) { this.options = options; }

    apply(compiler) {
      compiler.hooks.afterEmit.tap('AddLicenseAfterTerserPlugin', () => {
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

  // Plugin to remove LICENSE.txt
  class RemoveLicenseFilePlugin {
    apply(compiler) {
      compiler.hooks.emit.tap('RemoveLicenseFilePlugin', (compilation) => {
        for (const name in compilation.assets) {
          if (name.endsWith('LICENSE.txt')) delete compilation.assets[name];
        }
      });
    }
  }

  return {
    entry: `./src/${packageData.FILENAME}.js`,
    output: {
      path: path.resolve(process.cwd(), 'dist'),
      filename: packageData.main.split('/').pop(),
      library: { type: 'module' },
    },
    experiments: { outputModule: true },
    optimization: { minimizer: [new TerserPlugin({ extractComments: false })] },
    plugins: [new RemoveLicenseFilePlugin(), new AddLicenseAfterTerserPlugin()],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: { loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } },
        },
      ],
    },
    resolve: { extensions: ['.js'] },
    externals: { ace: 'ace' },
  };
}

// Export for both require and import
if (typeof module !== 'undefined' && module.exports) {
  module.exports = getWebpackConfig();
} else {
  export default getWebpackConfig();
}
