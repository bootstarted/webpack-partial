import curry from 'lodash/curry';
import set from 'lodash/fp/set';

export default curry((src, target, config) =>
  set(['resolve', 'alias', src], target, config)
);
