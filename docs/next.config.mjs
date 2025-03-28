import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

export default withNextra({
  reactStrictMode: true,
  transpilePackages: [
    "nativewind",
    "react-native-css-interop",
    "react-native-web",
    "react-native",
    "react-native-safe-area-context",
    "react-native-reanimated",
    "react-native-vector-icons"
  ],
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
      'react-native-safe-area-context': 'react-native-safe-area-context/lib/module/index.js',
    };

    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...(config.resolve.extensions || []),
    ];

    // Handle TypeScript files in react-native
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: /node_modules\/react-native/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript'],
            plugins: ['@babel/plugin-transform-flow-strip-types']
          }
        }
      ]
    });

    // Handle JS files in react-native-vector-icons
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/react-native-vector-icons/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-transform-flow-strip-types']
          }
        }
      ]
    });

    // Handle font files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    });

    return config;
  },
});
