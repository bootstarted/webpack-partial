# webpack-partial

Intelligently merge webpack configuration files.

![build status](http://img.shields.io/travis/izaakschroeder/webpack-partial/master.svg?style=flat)
![coverage](http://img.shields.io/coveralls/izaakschroeder/webpack-partial/master.svg?style=flat)
![license](http://img.shields.io/npm/l/webpack-partial.svg?style=flat)
![version](http://img.shields.io/npm/v/webpack-partial.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/webpack-partial.svg?style=flat)

```javascript
import partial from 'webpack-partial';

import config1 from './my/config/1.webpack.config.js';
import config2 from './my/config/2.webpack.config.js';

export default partial(
  { entry: './src/input.js' },
  config1,
  config2,
  { plugins: [ new MyPlugin() ] },
  // ...
);
```
