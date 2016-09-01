import {expect} from 'chai';
import root from '../../lib/root';

describe('alias', () => {
  it('should handle empty configs', () => {
    expect(root('/foo', {}))
      .to.have.property('resolve')
      .to.have.property('root')
      .to.contain('/foo');
  });

  it('should handle empty resolve options', () => {
    expect(root('/foo', {resolve: {}}))
      .to.have.property('resolve')
      .to.have.property('root')
      .to.contain('/foo');
  });

  it('should join relative paths', () => {
    expect(root('foo', {context: '/baz'}))
      .to.have.property('resolve')
      .to.have.property('root')
      .to.contain('/baz/foo');
  });

  it('should append to single values', () => {
    expect(root('/foo', {resolve: {root: '/bar'}}))
      .to.have.property('resolve')
      .to.have.property('root')
      .to.contain('/foo')
      .to.contain('/bar');
  });

  it('should append to arrays', () => {
    expect(root('/foo', {resolve: {root: ['/bar']}}))
      .to.have.property('resolve')
      .to.have.property('root')
      .to.contain('/foo')
      .to.contain('/bar');
  });
});
