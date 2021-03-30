/**
 * Jest configuration
 */
module.exports = {
  presets: [
    // prettier-ignore
    ['@babel/preset-env',
    {
      targets: {
        esmodules: true,
      },
    }],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: ['@babel/plugin-proposal-class-properties'],
};
