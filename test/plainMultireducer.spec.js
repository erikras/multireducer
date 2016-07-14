import expect from 'expect';
import multireducer from '../src/plainMultireducer';
import wrapAction from '../src/wrapAction';
import counter, { increment, decrement } from './counters/plain';

const reducer = multireducer({
  a: counter,
  b: counter,
  c: counter
});
const incrementA = wrapAction(increment(), 'a');
const incrementB = wrapAction(increment(), 'b');
const incrementC = wrapAction(increment(), 'c');

const decrementA = wrapAction(decrement(), 'a');
const decrementB = wrapAction(decrement(), 'b');
const decrementC = wrapAction(decrement(), 'c');

describe('plainMultireducer', () => {
  it('should initialize properly', () => {
    expect(reducer()).toEqual({
      a: { count: 0 },
      b: { count: 0 },
      c: { count: 0 }
    });
  });

  it('should throw an error if you use custom mount point and reducerKey is not specified', () => {
    const errorMessage = 'No key specified for custom mounting of reducer';
    expect(() => multireducer(counter)).toThrow(errorMessage);
  });

  it('should respond to actions when mounted as a single reducer', () => {

    const singleReducer = multireducer(counter, 'a');

    let state = {
      count: 5
    };

    expect(singleReducer(state, incrementA))
      .toEqual({
        count: 6
      });

    state = {
      count: 11
    };

    expect(singleReducer(state, decrementA))
      .toEqual({
        count: 10
      });
  });

  it('should not respond to unbound action', () => {
    const state = {
      a: { count: 5 },
      b: { count: 69 },
      c: { count: 0 }
    };
    expect(reducer(state, increment())).toEqual(state);
    expect(reducer(state, decrement())).toEqual(state);
  });

  it('should direct action based on key', () => {
    const state = {
      a: { count: 5 },
      b: { count: 69 },
      c: { count: 0 }
    };

    expect(reducer(state, incrementA))
      .toEqual({
        a: { count: 6 },
        b: { count: 69 },
        c: { count: 0 }
      });
    expect(reducer(state, incrementB))
      .toEqual({
        a: { count: 5 },
        b: { count: 70 },
        c: { count: 0 }
      });
    expect(reducer(state, incrementC))
      .toEqual({
        a: { count: 5 },
        b: { count: 69 },
        c: { count: 1 }
      });
    expect(reducer(state, decrementA))
      .toEqual({
        a: { count: 4 },
        b: { count: 69 },
        c: { count: 0 }
      });
    expect(reducer(state, decrementB))
      .toEqual({
        a: { count: 5 },
        b: { count: 68 },
        c: { count: 0 }
      });
    expect(reducer(state, decrementC))
      .toEqual({
        a: { count: 5 },
        b: { count: 69 },
        c: { count: -1 }
      });
  });
});
