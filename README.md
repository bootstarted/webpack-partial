# webpack-partial

Intelligently compose [webpack] configuration files.

![build status](http://img.shields.io/travis/webpack-config/webpack-partial/master.svg?style=flat)
![coverage](http://img.shields.io/coveralls/webpack-config/webpack-partial/master.svg?style=flat)
![license](http://img.shields.io/npm/l/webpack-partial.svg?style=flat)
![version](http://img.shields.io/npm/v/webpack-partial.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/webpack-partial.svg?style=flat)


## Usage

```sh
npm install --save webpack-partial
```

Making [webpack] configurations composable is tricky. So we provide several helpers to ease the composition process. Each helper is of the form `(arg1, arg2, ..., webpackConfig)`. All functions are curried and the last argument is always a webpack configuration object allowing you to chain helpers together easily with `compose` (or `flow`).

Generally:

```javascript
import compose from 'lodash/fp/compose';
import plugin from 'webpack-partial/plugin';
import StatsWebpackPlugin from 'stats-webpack-plugin';
import ExtractTextWebpackPlugin from 'extract-text-webpack-plugin';

const buildConfig = compose(
  plugin(new StatsWebpackPlugin()),
  plugin(new ExtractTextWebpackPlugin())
);

const config = buildConfig({/* webpack config here */});
```

But you can also use them individually if you need to:

```javascript
import plugin from 'webpack-partial/plugin';
import StatsWebpackPlugin from 'stats-webpack-plugin';

const config = plugin(new StatsWebpackPlugin(), {/* webpack config here */});
```

The available helpers are:

 * loader
 * merge
 * output
 * plugin
 * tap

### loader(loader, config)

Add a loader configuration to an existing webpack configuration.

```javascript
import loader from 'webpack-partial/loader';

const babel = loader({
  test: /\.js$/,
  loader: 'babel-loader',
})
babel(webpackConfig);
```

### merge(source, target)

Take an existing webpack configuration and try to intelligently merge it into another webpack configuration. Since webpack is weird and we don't always know what you want merge makes a best effort – it might not always get it right. There are other more precise functions you can use if you need.

The rules for merging entries are:

 * Replace any primitive value (string, number, etc.).
 * Concatenate arrays; if entries share a `name` property, merge them instead.
 * Merge objects; if entries share the same key, merge them instead.
 * The webpack `entry` configuration value is always replaced.

```javascript
import merge from 'webpack-partial/merge';

const devMode = merge({
  devtool: 'source-map',
  module: {
    preLoaders: {
      test: /\.js$/,
      loader: 'eslint-loader'
    }
  }
});
devMode(webpackConfig);
```

### output(object, config)

Merge the given output options into the output options in a webpack configuration. You can use it to do things like quickly change the `publicPath`.

```javascript
import output from 'webpack-partial/output';
const rebase = output({publicPath: '/somewhere'});
rebase(webpackConfig);
```

### plugin(object, config)

Append a plugin to the existing plugins in a webpack configuration.

```javascript
import plugin from 'webpack-partial/plugin';
import StatsWebpackPlugin from 'stats-webpack-plugin';

const stats = plugin(new StatsWebpackPlugin())
stats(webpackConfig);
```

### tap(func, config)

Observe the configuration but ignore any modifications. Can be useful to do things like dumping out a configuration.

```javascript
import tap from 'webpack-partial/tap';
const debug = tap((config) => console.log(config));
debug(webpackConfig);
```

[webpack]: http://webpack.github.io/
