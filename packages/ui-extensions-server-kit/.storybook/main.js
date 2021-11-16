const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    {
      name: '@storybook/preset-scss',
      options: {
        cssLoaderOptions: {
          modules: {
            localIdentName: '[name]__[local]--[hash:base64:5]',
          },
        },
      },
    },
  ],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    config.resolve.alias = Object.assign(config.resolve.alias, {
      components: path.resolve(__dirname, '../src/components'),
      state: path.resolve(__dirname, '../src/state'),
      testing: path.resolve(__dirname, '../src/testing'),
      types: path.resolve(__dirname, '../src/types'),
      utilities: path.resolve(__dirname, '../src/utilities'),
    });

    return config;
  },
};
