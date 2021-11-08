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
    config.module.rules.push(      {
      test: /\.scss$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            esModule: true,
            importLoaders: 1,
            modules: {
              auto: (resourcePath) =>
                !resourcePath.includes('node_modules/') ||
                resourcePath.endsWith('.scss'),
              localIdentName: '[name]-[local]_[hash:base64:5]',
            },
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [['@shopify/postcss-plugin', {minimize: false}]],
            },
          },
        },
        {
          loader: 'sass-loader',
          options: {
            implementation: require('node-sass'),
            sassOptions: {
              includePaths: [path.resolve(__dirname, '../app/styles')],
            },
          },
        },
        {
          loader: 'sass-resources-loader',
          options: {
            resources: [
              path.resolve(
                __dirname,
                '../node_modules/@shopify/polaris/dist/styles/_public-api.scss',
              ),
            ],
          },
        },
      ],
    },
    {
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    },
    {
      test: /icons\/.*\.svg$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              ['@shopify/babel-preset', {typescript: true, react: true}],
            ],
          },
        },
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: svgOptimizationOptions(),
            replaceAttrValues: {
              // Old design language
              '#FFF': 'currentColor',
              '#fff': 'currentColor',
              '#637381': '{undefined}',
              '#212B36': '{undefined}',
              '#212b36': '{undefined}',

              // New design language
              '#5C5F62': '{undefined}',
              '#5c5f62': '{undefined}',
            },
            babel: false,
          },
        },
      ],
    },
    {
      test: /\.graphql$/,
      use: [
        {
          loader: 'graphql-mini-transforms/webpack-loader',
          options: {simple: true},
        },
      ],
    },);

    return config;
  }
};
