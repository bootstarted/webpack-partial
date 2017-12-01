import curry from 'lodash/curry';
import findIndex from 'lodash/findIndex';
import u from 'lodash/fp/update';
import r from 'lodash/fp/remove';
import f from 'lodash/fp/find';
import flow from 'lodash/fp/flow';
import isEqual from 'lodash/fp/isEqual';
import isMatch from 'lodash/fp/isMatch';
import isFunction from 'lodash/fp/isFunction';
import map from 'lodash/fp/map';
import getOr from 'lodash/fp/getOr';

export const __config = {isWebpack2: false};

let verify = (x) => x;

try {
  const pkg = require('webpack/package.json');
  const [majorVersion] = pkg.version.match(/\d+\./);
  __config.isWebpack2 = parseInt(majorVersion) >= 2;
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

export const matcher = (loader) => {
  if (!isFunction(loader)) {
    throw new TypeError("Invalid match function.");
  }
  return loader;
}

export const remove = curry((loader, config) => {
  return u(path(loader), (all = []) => r(matcher(loader), all), config);
});

export const update = curry((loader, fn, config) => {
  const m = matcher(loader);
  return u(path(loader), (all = []) => map((entry) => {
    return m(entry) ? normalize(verify(fn(entry, config))) : entry;
  }, all), config);
});

export const find = curry((loader, config) => {
  return f(matcher(loader), getOr([], path(loader), config));
});

const path = (loader) => {
  if (__config.isWebpack2) {
    return ['module', 'loaders'];
  }
  if (loader.enforce === 'pre') {
    return ['module', 'preLoaders'];
  }
  return ['module', 'loaders'];
}

let counter = 0;

const loader = (combine) => curry((loader, config) => {
  return u(path(loader), (all = []) => combine(
    all,
    normalize(verify(isFunction(loader) ? loader(config) : loader)),
  ), config);
});

export const append = loader((all, next) => [...all, next]);

export const prepend = loader((all, next) => [next, ...all]);

export default Object.assign(append, {
  append,
  prepend,
  update,
  find,
  remove,
});
