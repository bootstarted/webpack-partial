import curry from 'lodash/curry';
import findIndex from 'lodash/findIndex';

let verify = () => {};

try {
  // Use webpack2 to automatically verify loaders when possible. This allows
  // us to catch errors early on when the configuration is made instead of
  // when it's used.
  const validate = require('webpack/lib/validateWebpackOptions');
  const Err = require('webpack/lib/WebpackOptionsValidationError');
  verify = (loader) => {
    var errors = validate({
      entry: 'stub.js',
      module: {loaders: [loader]},
    });
    if (errors.length) {
      throw new Err(errors);
    }
  };
} catch (err) /* adana: +ignore */ {
  // No webpack2 so RIP.
}

export default curry((loader, config) => {
  const loaders = config.module && config.module.loaders ?
    config.module.loaders.slice() : [];

  verify(loader);
  loaders.push(loader);

  return {
    ...config,
    module: {
      ...(config.module ? config.module : {}),
      loaders,
    },
  };
});
