'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = multireducerBind;

var _key = require('./key');

var _key2 = _interopRequireDefault(_key);

var _mapValues = require('./mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function multireducerBind(action, multireducerKey) {
  if (typeof action === 'function') {
    return function () {
      return _extends({}, action.apply(undefined, arguments), _defineProperty({}, _key2.default, multireducerKey));
    };
  }
  if ((typeof action === 'undefined' ? 'undefined' : _typeof(action)) === 'object') {
    return (0, _mapValues2.default)(action, function (value) {
      return multireducerBind(value, multireducerKey);
    });
  }
  return action;
}