import merge from 'lodash/mergeWith';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';
import reduce from 'lodash/reduce';
import groupBy from 'lodash/groupBy';

// TODO: Why does `Symbol()` not work for this?
const unique = '___uniq!';

const entry = (dst, src) => {
  if (typeof dst === 'object' && typeof src === 'object') {
    return {
      ...dst,
      ...src,
    };
  }
  return src;
};

const name = (entry) => {
  return isFunction(entry) || (entry && isUndefined(entry.name)) ?
    unique : entry.name;
};

export const inherit = (...args) => {
  return merge(
    ...args,
    (dst, src, key, object, source) => {
      // Treat entry specially since order is important we can't go just
      // randomly appending things.
      // Treat arrays with objects that have the `name` property specially;
      // entries with identical names will be merged.
      if (key === 'entry' && src === source.entry) {
        return entry(dst, src);
      } else if (isArray(dst) && isArray(src)) {
        return reduce(groupBy(dst.concat(src), name), (items, group, name) => {
          return name !== unique ?
            items.concat(inherit(...group)) : items.concat(...group);
        }, []);
      }
    }
  );
};

export const normalize = (conf, entry) => {
  if (typeof entry === 'string') {
    throw new TypeError('Cannot `require` partials.');
  } else if (typeof entry === 'function') {
    return entry(conf);
  }
  return entry;
};

export default (...args) => {
  return args.reduce((conf, entry) => {
    return inherit(conf, normalize(conf, entry));
  }, { });
};
