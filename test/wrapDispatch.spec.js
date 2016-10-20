import expect, { createSpy } from 'expect';
import wrapDispatch from '../src/wrapDispatch';
import wrapAction from '../src/wrapAction';
import { increment } from './counters/plain';

describe('wrapDispatch', () => {
  it('dispatch plain object action', () => {
    const dispatch = createSpy();
    const action = increment();
    const wrappedDispatch = wrapDispatch(dispatch, 'additional');
    wrappedDispatch(action);

    expect(dispatch.calls.length).toBe(1);
    expect(dispatch.calls[0].arguments).toEqual([wrapAction(action, 'additional')]);
  });

  it('dispatch thunk action', () => {
    const getState = () => {};
    const dispatch = createSpy().andCall(action => action(dispatch, getState));
    const action = createSpy();
    const wrappedDispatch = wrapDispatch(dispatch, 'additional');
    wrappedDispatch(action);

    expect(dispatch.calls.length).toBe(1);
    expect(dispatch.calls[0].arguments.length).toBe(1);
    expect(action.calls.length).toBe(1);
    expect(action.calls[0].arguments).toEqual([
      wrappedDispatch,
      getState,
      dispatch,
      'additional'
    ]);
  });
});
