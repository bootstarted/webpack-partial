import {
  merge,
  isArray,
  map,
  isFunction,
  isUndefined,
  reduce,
  groupBy
} from 'lodash';
import path from 'path';

// TODO: Why does `Symbol()` not work for this?
const unique = '___uniq!';

function entry(dst, src) {
  if (typeof dst === 'object' && typeof src === 'object') {
    return {
      ...dst,
      ...src
    };
  }
  return src;
}

export function inherit(...args) {
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
        const all = dst.concat(src);
        const entries = groupBy(
          all,
          entry => isFunction(entry) || (entry && isUndefined(entry.name)) ?
            unique : entry.name
        );
        return reduce(entries, (items, group, name) => {
          return name !== unique ?
            items.concat(inherit(...group)) : items.concat(...group)
        }, []);
      }
    }
  );
}

export function normalize(conf, entry) {
  if (typeof entry === 'string') {
    throw new TypeError('Cannot `require` partials.');
  } else if (typeof entry === 'function') {
    return entry(conf);
  }
  return entry;
}

export default function apply(...args) {
  return args.reduce((conf, entry) => {
    return inherit(conf, normalize(conf, entry));
  }, { });
}
