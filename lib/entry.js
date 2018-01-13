import curry from 'lodash/curry';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isUndefined from 'lodash/isUndefined';
import castArray from 'lodash/castArray';

const _flatMap = (fn, key, entries) => {
  if (isString(entries)) {
    return fn([entries], key);
  } else if (isArray(entries)) {
    return fn(entries, key);
  } else if (isObject(entries)) {
    const res = {};
    for (const key of Object.keys(entries)) {
      res[key] = _flatMap(fn, key, entries[key]);
    }
    return res;
  }
  else if (isUndefined(entries)) {
    return fn([], key);
  }
  throw new TypeError('Unknown shape of `entry` object.');
};

export const flatMap = (fn, config) => ({
  ...config,
  entry: _flatMap(fn, null, config.entry),
});

const normalize = (values, previous, key, config) => {
  if (isFunction(values)) {
    return values(previous, key, config);
  }
  return values;
}

export const append = curry((values, config) =>
  flatMap((modules, key) => [
    ...modules,
    ...castArray(normalize(values, modules, key, config))
  ], config)
);

export const prepend = curry((values, config) =>
  flatMap((modules, key) => [
    ...castArray(normalize(values, modules, key, config)),
    ...modules,
  ], config)
);

export const replace = curry((values, config) =>
  flatMap((modules, key) =>
    normalize(values, modules, key, config),
    config
  )
);

replace.append = append;
replace.prepend = prepend;

export default replace;
