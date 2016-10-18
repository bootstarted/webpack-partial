import {expect} from 'chai';
import loader, {__config} from '../../lib/loader';

describe('loader', () => {
  it('should handle empty configs', () => {
    expect(loader({test: /foo/}, {}))
      .to.have.property('module')
      .to.have.property('loaders')
      .to.have.length(1);
  });

  it('should handle empty module options', () => {
    expect(loader({test: /foo/}, {module: {}}))
      .to.have.property('module')
      .to.have.property('loaders')
      .to.have.length(1);
  });

  it('should append by default', () => {
    expect(loader({test: /foo/}, {module: {loaders: [1]}}))
      .to.have.property('module')
      .to.have.property('loaders')
      .to.have.length(2);
  });

  it('should fail with extra properties', () => {
    expect(() => {
      loader(
        {name: 'x', color: 'green'},
        {module: {loaders: [{name: 'x', test: 'bar', color: 'red'}]}}
      )
    }).to.throw(Error)
  });

  describe('webpack@1', () => {
    beforeEach(() => {
      __config.isWebpack2 = false;
    });
    afterEach(() => {
      __config.isWebpack2 = true;
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
  });


});
