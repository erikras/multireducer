import wrapAction from './wrapAction';

export default function wrapDispatch(dispatch, multireducerKey) {
  const wrappedDispatch = (action) => {
    let wrappedAction;
    if (typeof action === 'function') {
      wrappedAction = (_, getState) => action(wrappedDispatch, getState);
    } else if (typeof action === 'object') {
      wrappedAction = wrapAction(action, multireducerKey);
    }
    return dispatch(wrappedAction);
  };

  return wrappedDispatch;
}
