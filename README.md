# webpack-partial

Intelligently merge webpack configuration files.

![build status](http://img.shields.io/travis/webpack-config/webpack-partial/master.svg?style=flat)
![coverage](http://img.shields.io/coveralls/webpack-config/webpack-partial/master.svg?style=flat)
![license](http://img.shields.io/npm/l/webpack-partial.svg?style=flat)
![version](http://img.shields.io/npm/v/webpack-partial.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/webpack-partial.svg?style=flat)

Take a multiple webpack configurations (or functions generating webpack configurations) and merge them. Usually used in the manner of `partial(fullConfig, partialConfig)` to return a new complete configuration.

The rules for merging entries are:

 * Replace any primitive value (string, number, etc.).
 * Concatenate arrays; if entries share a `name` property, merge them instead.
 * Merge objects; if entries share the same key, merge them instead.
 * The webpack `entry` configuration value is always replaced.

```javascript
import partial from 'webpack-partial';

import config1 from './my/config/1.webpack.config.js';

export default (existingWebpackConfiguration) => partial(
  existingWebpackConfiguration,
  { entry: './src/input.js' },
  config1,
  { plugins: [ new MyPlugin() ] },
  // ...
);
```
