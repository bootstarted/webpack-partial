import curry from 'lodash/curry';
import findIndex from 'lodash/findIndex';

export default curry((loader, config) => {
  const loaders = config.module && config.module.loaders ?
    config.module.loaders.slice() : [];

  if (loader.name) {
    const index = findIndex(loaders, {name: loader.name});
    if (index === -1) {
      loaders.push(loader);
    } else {
      loaders[index] = {
        ...loaders[index],
        ...loader,
      };
    }
  } else {
    loaders.push(loader);
  }

  return {
    ...config,
    module: {
      ...(config.module ? config.module : {}),
      loaders,
    },
  };
});
