import {expect} from 'chai';
import output from '../../lib/output';

describe('output', () => {
  it('should update `output` in the config', () => {
    const conf = {output: {foo: 'a', bar: 'b'}};
    const result = output({foo: 'x', baz: 'y'}, conf);
    expect(result).to.have.property('output').to.have.property('foo', 'x');
    expect(result).to.have.property('output').to.have.property('baz', 'y');
  });
});
