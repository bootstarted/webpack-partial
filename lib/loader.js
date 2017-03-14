import curry from 'lodash/curry';
import findIndex from 'lodash/findIndex';
import update from 'lodash/fp/update';
import flow from 'lodash/fp/flow';
import isEqual from 'lodash/fp/isEqual';

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
  const validate = require('webpack/lib/validateSchema');
  const schema = require('webpack/schemas/webpackOptionsSchema.json');
  const Err = require('webpack/lib/WebpackOptionsValidationError');
  verify = (loader) => {
    if (!__config.isWebpack2) {
      return loader;
    }
    var errors = validate(schema, {
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

const normalize = (loader) => {
  if (__config.isWebpack2) {
    return loader;
  }
  if (!loader.loaders || loader.loaders.length === 0) {
    return loader;
  }
  return {
    ...loader,
    loaders: loader.loaders.map((entry) => {
      if (typeof entry === 'string') {
        return entry;
      } else if (typeof entry === 'object') {
        if (entry.query) {
          const s = JSON.stringify(entry.query);
          if (!isEqual(JSON.parse(s), entry.query)) {
            throw new TypeError(`Invalid query as part of ${entry.loader}.`);
          }
          return `${entry.loader}?${s}`;
        }
        return entry.loader;
      }
      throw new TypeError();
    }),
  };
};

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
  normalize(verify(loader)),
]), config));
