import mapValues from './mapValues';
import key from './key';

export default function multireducer(reducers) {
  const initialState = mapValues(reducers, reducer => reducer());
  return (state = initialState, action) => {
    if (action) {
      const reducerKey = action[key];
      const reducer = reducers[reducerKey];
      if (reducer) {
        return {
          ...state,
          [reducerKey]: reducer(state[reducerKey], action)
        };
      }
    }
    return state;
  };
}
