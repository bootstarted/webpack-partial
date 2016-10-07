import {expect} from 'chai';
import loader from '../../lib/loader';

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
});
