import {expect} from 'chai';
import merge from '../../lib/merge';

describe('merge', () => {
  it('should work', () => {
    const source = {message: 'hello'};
    const target = {message: 'bye'};
    const result = merge(source, target);
    expect(result).to.have.property('message', 'hello');
  });
});
