import {expect} from 'chai';
import inject from '../../lib/inject';

describe('inject', () => {
  it('should handle strings', () => {
    expect(inject('index.js', ['a', 'b'])).to.have.length(3);
  });

  it('should handle arrays', () => {
    expect(inject(['index.js'], ['a', 'b'])).to.have.length(3);
  });

  it('should handle objects', () => {
    expect(inject({a: 'index.js'}, ['a', 'b']))
      .to.have.property('a').to.have.length(3);
  });

  it('should fail otherwise', () => {
    expect(() => inject(false)).to.throw(TypeError);
  });
});
