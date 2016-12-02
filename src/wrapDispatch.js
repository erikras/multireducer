import wrapAction from './wrapAction';

export default function wrapDispatch(dispatch, reducerKey) {
  const wrappedDispatch = (action) => {
    let wrappedAction;
    if (typeof action === 'function') {
      wrappedAction = (globalDispatch, getState, extraArgument) =>
        action(wrappedDispatch, getState, globalDispatch, reducerKey, extraArgument);
    } else if (typeof action === 'object') {
      wrappedAction = wrapAction(action, reducerKey);
    }
    return dispatch(wrappedAction);
  };

  return wrappedDispatch;
}
