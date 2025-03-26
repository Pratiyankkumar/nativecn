/** @type {import('@nativecn/cli').Config} */
module.exports = {
  styling: 'nativewind',
  theme: {
    useExisting: false,
    existingThemePath: null,
    defaultTheme: 'system',
    useSystemTheme: true,
  },
  components: {
    outDir: './components/ui',
    defaultProps: {
      Button: {
        variant: 'default',
        size: 'default',
      },
    },
  },
};
