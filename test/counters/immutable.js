// Welcome, curious code explorer!! This is a duck. https://github.com/erikras/ducks-modular-redux
import Immutable from 'immutable';

const INCREMENT = 'multireducer/counter/INCREMENT';
const DECREMENT = 'multireducer/counter/DECREMENT';

const initialState = Immutable.fromJS({
  count: 0
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return state.set('count', state.get('count') + 1);
    case DECREMENT:
      return state.set('count', state.get('count') - 1);
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
