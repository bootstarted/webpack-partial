import {expect} from 'chai';
import sinon from 'sinon';
import tap from '../../lib/tap';

describe('tap', () => {
  it('should return the original config', () => {
    const conf = {message: 'hello'};
    expect(tap(() => false, conf)).to.equal(conf);
  });

  it('should call the given function', () => {
    const stub = sinon.stub();
    tap(stub, 'test');
    expect(stub).to.be.calledWith('test');
  });
});
