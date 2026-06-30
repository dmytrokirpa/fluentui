// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import webpackBundler from 'monosize-bundler-webpack';
import createAzureStorage from 'monosize-storage-azure';
import { GriffelPlugin } from '@griffel/webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

/** @type {import('monosize').MonoSizeConfig} */
const config = {
  repository: 'https://github.com/microsoft/fluentui',
  storage: createAzureStorage({
    authType: 'DefaultAzureCredential',
    endpoint: 'https://fluent-bundlesize.azurewebsites.net/api/fluentuilatest',
    tableName: 'fluentuilatest',
  }),
  bundler: webpackBundler(config => {
    config.externals = config.externals ?? {};
    config.externals = {
      react: 'React',
      'react/jsx-runtime': 'jsxRuntime',
      'react-dom': 'ReactDOM',
      'react/compiler-runtime': 'ReactCompilerRuntime',
    };

    config.module = config.module ?? {};
    config.module.rules = config.module.rules ?? [];

    config.resolve = config.resolve ?? {};
    config.resolve.extensions = ['.raw.js', '...'];

    config.module.rules.push({
        test: /\.(js|ts|tsx)$/,
        // Apply "exclude" only if your dependencies **do not use** Griffel
        // exclude: /node_modules/,
        use: {
          loader: '@griffel/webpack-plugin/loader',
        },
      },
      // "css-loader" and "mini-css-extract-plugin" are required to handle CSS assets produced by Griffel
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }
    );

    config.plugins = config.plugins ?? [];
    config.plugins.push(new MiniCssExtractPlugin(), new GriffelPlugin());

    return config;
  }),
  reportResolvers: {
    packageName: async packageRoot => {
      const packageJson = await fs.promises.readFile(path.join(packageRoot, 'package.json'), 'utf-8');
      const json = JSON.parse(packageJson);
      return json.name.replace('@fluentui/', '');
    },
  },
  assetTypes: ['js', 'css'],
};

export default config;
