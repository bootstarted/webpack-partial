
import { merge, isArray, map } from 'lodash';
import path from 'path';

export function inherit(...args) {
	return merge(
		...args,
		(dst, src, key, object, source) => {
			// Treat entry specially since order is important we can't go just
			// randomly appending things.
			if (key === 'entry' && src === source.entry) {
				return src;
			} else if (isArray(dst) && isArray(src)) {
				return dst.concat(src);
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
