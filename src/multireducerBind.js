import key from './key';
import mapValues from './mapValues';

export default function multireducerBind(action, multireducerKey) {
  if (typeof action === 'function') {
    return (...args) => ({
      ...action(...args),
      [key]: multireducerKey
    });
  }
  if (typeof action === 'object') {
    return mapValues(action, value => multireducerBind(value, multireducerKey));
  }
  return action;
}
