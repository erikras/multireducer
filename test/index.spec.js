import expect from 'expect';
import plainMultireducer from '../src/plainMultireducer';
import bindActionCreators from '../src/bindActionCreators';
import wrapDispatch from '../src/wrapDispatch';
import wrapAction from '../src/wrapAction';
import multireducer, * as mainExports from '../src/index';

describe('main exports', () => {
  it('should export the plainMultireducer as default', () => {
    expect(multireducer).toBeA('function').toEqual(plainMultireducer);
  });
  it('should export the bindActionCreators', () => {
    expect(mainExports.bindActionCreators).toBeA('function').toEqual(bindActionCreators);
  });
  it('should export the wrapDispatch', () => {
    expect(mainExports.wrapDispatch).toBeA('function').toEqual(wrapDispatch);
  });
  it('should export the wrapAction', () => {
    expect(mainExports.wrapAction).toBeA('function').toEqual(wrapAction);
  });
});
