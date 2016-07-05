import key from './key';

export default function wrapAction(action, reducerKey) {
  return {
    ...action,
    meta: {
      ...action.meta,
      [key]: reducerKey,
    }
  };
}
