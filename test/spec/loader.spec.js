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

  it('should merged duplicate named loaders', () => {
    const result = loader(
      {name: 'x', color: 'green'},
      {module: {loaders: [{name: 'x', test: 'bar', color: 'red'}]}}
    );

    expect(result)
      .to.have.property('module')
      .to.have.property('loaders')
      .to.have.length(1);
    expect(result.module.loaders[0]).to.have.property('test', 'bar');
    expect(result.module.loaders[0]).to.have.property('color', 'green');
  });

  it('should not merged non-duplicate named loaders', () => {
    const result = loader(
      {name: 'y', color: 'green'},
      {module: {loaders: [{name: 'x', test: 'bar', color: 'red'}]}}
    );

    expect(result)
      .to.have.property('module')
      .to.have.property('loaders')
      .to.have.length(2);
  });
});
