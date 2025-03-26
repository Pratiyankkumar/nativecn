import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

export default withNextra({
  reactStrictMode: true,
  webpack: config => {
    // Only needed if you're still using React Native Web components
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };

    return config;
  },
});
