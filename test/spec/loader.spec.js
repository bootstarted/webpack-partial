import {expect} from 'chai';
import loader, {
  __config,
  update,
  remove,
  find,
  prepend,
} from '../../lib/loader';
import flow from 'lodash/fp/flow';
import isMatch from "lodash/fp/isMatch";

describe('loader', () => {
  it('should handle empty configs', () => {
    expect(loader({test: /foo/}, {}))
      .to.have.property('module')
      .to.have.property('rules')
      .to.have.length(1);
  });

  it('should handle empty module options', () => {
    expect(loader({test: /foo/}, {module: {}}))
      .to.have.property('module')
      .to.have.property('rules')
      .to.have.length(1);
  });

  it('should append by default', () => {
    expect(loader({test: /foo/}, {module: {rules: [1]}}))
      .to.have.property('module')
      .to.have.property('rules')
      .to.have.length(2);
  });

  it('should fail with extra properties', () => {
    expect(() => {
      loader(
        {name: 'x', color: 'green'},
        {module: {rules: [{name: 'x', test: 'bar', color: 'red'}]}}
      )
    }).to.throw(Error)
  });

  describe('webpack@1', () => {
    let oldVersion;
    beforeEach(() => {
      oldVersion = __config.webpackMajorVersion;
      __config.webpackMajorVersion = 1;
    });
    afterEach(() => {
      __config.webpackMajorVersion = oldVersion;
    });

    it('should use `preLoaders` when `enforce` is `pre`', () => {
      expect(loader({test: /foo/, enforce: 'pre'}, {}))
        .to.have.property('module')
        .to.have.property('preLoaders')
        .to.have.length(1);
    });

    it('should use `loaders` when no enforcement present', () => {
      expect(loader({test: /foo/}, {}))
        .to.have.property('module')
        .to.have.property('loaders')
        .to.have.length(1);
    });

    it('should turn `loader` with multiple `loaders` into strings', () => {
      const result = loader({
        test: /foo/,
        loaders: [
          'a',
          {loader: 'foo'},
          {loader: 'bar', query: {message: 'hello'}}
        ],
      }, {});
      const entry = result.module.loaders[0].loaders;
      expect(entry).to.have.length(3);
      expect(entry).to.have.property(0).to.equal('a');
      expect(entry).to.have.property(1).to.equal('foo');
      expect(entry).to.have.property(2).to.equal('bar?{"message":"hello"}');
    });

    it('should fail serializing functions', () => {
      expect(() => {
        loader(
          {loaders:[{loader: 'a', query: {x: () => {}}}]},
          {}
        )
      }).to.throw(TypeError);
    });

    it('should fail on garbage in loaders', () => {
      expect(() => {
        loader(
          {loaders:[5]},
          {}
        )
      }).to.throw(TypeError);
    });
  });

  describe('update', () => {
    it('should update the matching target', () => {
      const result = flow(
        loader({
          test: /foo/,
          loader: 'a',
        }),
        update(isMatch({loader: 'a'}), (loader) => {
          return {
            ...loader,
            loader: 'b',
          };
        }),
      )({});
      const entry = result.module.rules[0];
      expect(entry).to.have.property('loader').to.equal('b');
    });
    it('should ignore non-matching targets', () => {
      const result = flow(
        loader({
          test: /foo/,
          loader: 'a',
        }),
        update(isMatch({loader: 'z'}), (loader) => {
          return {
            ...loader,
            loader: 'b',
          };
        }),
      )({});
      const entry = result.module.rules[0];
      expect(entry).to.have.property('loader').to.equal('a');
    });
  });

  describe('remove', () => {
    it('should remove the matching target', () => {
      const result = flow(
        loader({
          test: /foo/,
          loader: 'a',
        }),
        remove(isMatch({loader: 'a'}))
      )({});
      const entry = expect(result.module.rules).to.have.length(0);
    });
    it('should ignore non-matching targets', () => {
      const result = flow(
        loader({
          test: /foo/,
          loader: 'a',
        }),
        remove(isMatch({loader: 'z'})),
      )({});
      expect(result.module.rules).to.have.length(1);
    });
  });

  describe('find', () => {
    it('should find things', () => {
      const result = loader({
        test: /foo/,
        loader: 'a',
      }, {});
      expect(
        find(isMatch({loader: 'a'}), result)
      ).to.have.property('loader', 'a');
    });
    it('should fail on bad matcher', () => {
      expect(() => loader.find('potato', {})).to.throw(TypeError);
    });
  });

  describe('prepend', () => {
    it('should prepend things', () => {
      const result = prepend({
        test: /foo/,
        loader: 'a',
      }, {module: {loaders: [{name: 'x', test: 'bar', color: 'red'}]}});
      expect(result)
        .to.have.property('module')
        .to.have.property('rules')
        .to.have.property(0)
        .to.have.property('loader', 'a');
    });
  });

  describe('functions', () => {
    it('should let you use functions for configs', () => {
      expect(loader(() => ({test: /foo/}), {}))
        .to.have.property('module')
        .to.have.property('rules')
        .to.have.length(1);
    });
  });
});
