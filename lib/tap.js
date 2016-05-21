import curry from 'lodash/curry';

export default curry((tap, config) => {
  tap(config);
  return config;
});
