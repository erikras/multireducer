import mapValues from './mapValues';
import key from './key';

export default function plainMultireducer(reducers, reducerKey) {
  let isCustomMountPoint;
  if (typeof reducers === 'function') {
    if (!reducerKey) {
      throw new Error('No key specified for custom mounting of reducer');
    } else {
      isCustomMountPoint = true;
    }
  }

  const initialState = isCustomMountPoint ?
    reducers(undefined, {}) :
    mapValues(reducers, reducer => reducer(undefined, {}));

  return (state = initialState, action) => {
    if (action && action.type && ~action.type.indexOf(key)) {
      const keyStart = action.type.indexOf(key);
      const keyOnward = action.type.substring(keyStart);
      const actionReducerKey = keyOnward.substring(key.length);

      const actionWithoutKey = {
        ...action,
        type: action.type.substring(0, keyStart)
      };

      // custom mount point
      if (isCustomMountPoint && reducerKey === actionReducerKey) {
        return reducers(state, actionWithoutKey);
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
