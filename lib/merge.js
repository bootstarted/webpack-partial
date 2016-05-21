import curry from 'lodash/curry';
import partial from './partial';

/**
 * Combine two webpack configurations.
 * @param {Object} source Webpack configuration to merge into `target`.
 * @param {Object} target Webpack configuration.
 * @returns {Object} New webpack configuration with desired bits merged in.
 */
export default curry((source, target) => {
  return partial(target, source);
});
