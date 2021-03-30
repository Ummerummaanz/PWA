const { configure } = require('oasis-os-build-scripts');

/**
 * Webpack configuration creator.
 * Return an object with Webpack configuration that should extend the base.
 * The base config can be found in 'oasis-os-build-scripts'
 *
 * @param {Object} env Webpack's env switch
 * @param {boolean} isProd True is --env production or if NODE_ENV="production"
 * @returns {import('webpack').Configuration} Webpack configuration
 */
const config = (env, isProd) => ({});

/**
 * Merge configurations with additional modules.
 * Additional modules can be enabled by setting them to true.
 */

module.exports = configure({ config });
