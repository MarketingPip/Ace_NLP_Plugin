async function loadModules() {
  let fs, path, packageData, TerserPlugin;
  
  // Dynamically load modules
 if (typeof require !== 'undefined') {
    // CommonJS: Use require()
    fs = require('fs');
    path = require('path');
    packageData = require('./license.config.js');
    TerserPlugin = require('terser-webpack-plugin');
  } else {
    // ESM environment: Use dynamic imports directly
    fs = await import('fs');
    path = await import('path');
    packageData = await import('./license.config.js');
    TerserPlugin = (await import('terser-webpack-plugin')).default;
  }

  // Define plugins and classes after modules are loaded
  class AddLicenseAfterTerserPlugin {
    constructor(options) {
      this.options = options;
    }

    apply(compiler) {
      compiler.hooks.afterEmit.tap('AddLicenseAfterTerserPlugin', compilation => {
        const outputPath = this.options.outputPath || compiler.options.output.path;
        const outputFileName = this.options.outputFileName || compiler.options.output.filename;

        // Construct the full path to the output file
        const outputFilePath = path.join(outputPath, outputFileName);

        // Read the existing file content
        fs.readFile(outputFilePath, 'utf8', (err, data) => {
          if (err) throw err;

          // Add your license text after minification (Terser)
          const licenseText = `${packageData.LICENSE} `;

          // Append license text to the existing file content
          const newContent = licenseText + data;

          // Write back the modified content to the output file
          fs.writeFile(outputFilePath, newContent, 'utf8', err => {
            if (err) throw err;
            console.log(`License added to ${outputFileName}`);
          });
        });
      });
    }
  }

  // taken from https://github.com/webpack/webpack/issues/12506#issuecomment-1360810560
  class RemoveLicenseFilePlugin {
    apply(compiler) {
      compiler.hooks.emit.tap("RemoveLicenseFilePlugin", (compilation) => {
        for (let name in compilation.assets) {
          if (name.endsWith("LICENSE.txt")) {
            delete compilation.assets[name];
          }
        }
      });
    }
  }

  // Now return the Webpack config after modules are loaded
  return {
    entry: `./src/${packageData.FILENAME}.js`,
    output: {
      path: path.resolve(__dirname, '..', 'dist'),
      filename: packageData.main.split("/").pop(),
      library: {
        type: 'module',
      },
    },
    experiments: {
      outputModule: true,
    },
    optimization: {
      minimizer: [new TerserPlugin({
        extractComments: false,
      })],
    },
    plugins: [
      new RemoveLicenseFilePlugin(),
      new AddLicenseAfterTerserPlugin({
        // Additional options can be passed here if needed
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js'],
    },
    externals: {
      ace: 'ace', // ace will be assumed to be available globally
    },
  };
}

// Call the async function and use its result to create the Webpack config
loadModules().then((webpackConfig) => {
  // Export the Webpack config after all async modules have been loaded
  module.exports = webpackConfig;
}).catch(err => {
  console.error("Error loading modules:", err);
});
