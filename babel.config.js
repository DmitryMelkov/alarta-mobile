module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          unstable_transformImportMeta: true,
        },
      ],
    ],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          root: ['./'],
          alias: {
            '@app': './app',
            '@src': './src',
            '@components': './src/components',
            '@store': './src/store',
            '@api': './src/api',
          },
        },
      ],
    ],
  };
};
