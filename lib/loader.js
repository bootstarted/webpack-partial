import curry from 'lodash/curry';
import findIndex from 'lodash/findIndex';
import update from 'lodash/fp/update';
import flow from 'lodash/fp/flow';

export const __config = {isWebpack2: false};

let verify = (x) => x;

try {
  const pkg = require('webpack/package.json');
  __config.isWebpack2 = /^2\./.exec(pkg.version);
} catch (err) /* adana: +ignore */ {
  // No webpack2 so RIP.
}

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
    return loader;
  };
} catch (err) /* adana: +ignore */ {
  // No webpack2 so RIP.
}

const path = (loader) => {
  if (__config.isWebpack2) {
    return ['module', 'loaders'];
  }
  if (loader.enforce === 'pre') {
    return ['module', 'preLoaders'];
  }
  return ['module', 'loaders'];
}

export default curry((loader, config) => update(path(loader), (all = []) => ([
  ...all,
  verify(loader),
]), config));
