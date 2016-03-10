// Welcome, curious code explorer!! This is a duck. https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';

const INCREMENT = 'multireducer/counter/INCREMENT';
const DECREMENT = 'multireducer/counter/DECREMENT';

const initialState = {
  count: 0
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return {
        count: state.count + 1
      };
    case DECREMENT:
      return {
        count: state.count - 1
      };
    default:
      return state;
  }
}

const initialStateImmutable = fromJS(initialState);

export function reducerImmutable(state = initialStateImmutable, action) {
  switch (action.type) {
    case INCREMENT:
      const newState = state.update('count', count => count + 1);
      return state.update('count', count => count + 1);
    case DECREMENT:
      return state.update('count', count => count - 1);
    default:
      return state;
  }
}


export function increment() {
  return {
    type: INCREMENT
  };
}

export function decrement() {
  return {
    type: DECREMENT
  };
}
