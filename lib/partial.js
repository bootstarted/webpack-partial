
import { merge, isArray, map, isUndefined, reduce, groupBy } from 'lodash';
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
					({ name }) => isUndefined(name) ? unique : name
				);
				return reduce(entries, (items, group, name) => {
					return name !== unique ?
						items.concat(inherit(...group)) : items.concat(...group)
				}, []);
			}
		}
	);
}

export default function apply(conf, ...args) {
	return inherit(conf, ...map(args, entry => {
		return require(path.join(
			conf.context, 'config', 'webpack', 'partial', entry + '.webpack.config'
		))(conf);
	}));
}
