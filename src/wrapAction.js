import key from './key';

export default function wrapAction(action, multireducerKey) {
  return {
    ...action,
    meta: {
      ...action.meta,
      [key]: multireducerKey,
    }
  };
}
