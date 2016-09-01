import {expect} from 'chai';
import alias from '../../lib/alias';

describe('alias', () => {
  it('should handle empty configs', () => {
    expect(alias('foo', 'bar', {}))
      .to.have.property('resolve')
      .to.have.property('alias')
      .to.have.property('foo', 'bar');
  });

  it('should handle empty resolve options', () => {
    expect(alias('foo', 'bar', {resolve: {}}))
      .to.have.property('resolve')
      .to.have.property('alias')
      .to.have.property('foo', 'bar');
  });

  it('should overwrite by default', () => {
    expect(alias('foo', 'baz', {resolve: {alias: {foo: 'bar'}}}))
      .to.have.property('resolve')
      .to.have.property('alias')
      .to.have.property('foo', 'baz');
  });
});
