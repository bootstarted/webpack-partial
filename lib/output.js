import curry from 'lodash/curry';

export default curry((output, config) => {
  return {
    ...config,
    output: {
      ...config.output,
      ...output,
    },
  };
});
