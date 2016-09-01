import curry from 'lodash/curry';
import update from 'lodash/fp/update';
import path from 'path';

export default curry((root, config) =>
  update(['resolve', 'root'], (existing) => {
    const x = root.charAt(0) === '/' ? root : path.join(config.context, root);
    if (Array.isArray(existing)) {
      return [...existing, x];
    } else if (existing) {
      return [existing, x];
    }
    return [x];
  }, config)
);
