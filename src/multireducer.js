import mapValues from './mapValues';
import key from './key';

export default function multireducer(reducers, reducerKey) {
  let isCustomMountPoint;
  if (typeof reducers === 'function') {
    if (!reducerKey) {
      throw new Error(`No key specified for custom mounting of reducer`);
    } else {
      isCustomMountPoint = true;
    }
  }

  const initialState = isCustomMountPoint ? reducers() : mapValues(reducers, reducer => reducer());

  return (state = initialState, action) => {
    if (action && action.type && action.type.includes(key)) {
      const keyStart = action.type.indexOf(key);
      const keyOnward = action.type.substring(keyStart);
      const actionReducerKey = keyOnward.substring(key.length);

      const actionWithoutKey = {
        ...action,
        type: action.type.substring(0, keyStart)
      };

      // custom mount point
      if (isCustomMountPoint && reducerKey === actionReducerKey) {
        const newStateValue = reducers(state, actionWithoutKey);

        // state is object
        if (typeof newStateValue === 'object') {
          return {
            ...state,
            ...newStateValue
          };
        }
        // case for simple state slices (numbers, strings etc.)
        return newStateValue;
      }

      // usual multireducer mounting
      const reducer = reducers[actionReducerKey];

      if (reducer) {
        return {
          ...state,
          [actionReducerKey]: reducer(state[actionReducerKey], actionWithoutKey)
        };
      }
    }

    return state;
  };
}
