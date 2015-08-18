
import { merge, isArray, map } from 'lodash';
import path from 'path';

export function inherit(...args) {
	return merge(...args, (a, b) => isArray(a) ? a.concat(b) : undefined);
}

export default function apply(conf, ...args) {
	return inherit(conf, ...map(args, entry => {
		return require(path.join(
			conf.context, 'config', 'webpack', 'partial', entry + '.webpack.config'
		))(conf);
	}));
}
