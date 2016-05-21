import {expect} from 'chai';
import plugin from '../../lib/plugin';

describe('plugin', () => {
  it('should add a plugin to the config', () => {
    const conf = {plugins: []};
    expect(plugin({}, conf)).to.have.property('plugins')
      .to.have.length(1);
  });
});
