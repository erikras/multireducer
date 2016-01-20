'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = multireducer;

var _mapValues = require('./mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _key = require('./key');

var _key2 = _interopRequireDefault(_key);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function multireducer(reducers, reducerKey) {
  var isCustomMountPoint = undefined;
  if (typeof reducers === 'function') {
    if (!reducerKey) {
      throw new Error('No key specified for custom mounting of reducer');
    } else {
      isCustomMountPoint = true;
    }
  }

  var initialState = isCustomMountPoint ? reducers() : (0, _mapValues2.default)(reducers, function (reducer) {
    return reducer();
  });

  return function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments[1];

    if (action && action.type && action.type.includes(_key2.default)) {
      var keyStart = action.type.indexOf(_key2.default);
      var keyOnward = action.type.substring(keyStart);
      var actionReducerKey = keyOnward.substring(_key2.default.length);

      var actionWithoutKey = _extends({}, action, {
        type: action.type.substring(0, keyStart)
      });

      // custom mount point
      if (isCustomMountPoint && reducerKey === actionReducerKey) {
        var newStateValue = reducers(state, actionWithoutKey);

        // state is object
        if ((typeof newStateValue === 'undefined' ? 'undefined' : _typeof(newStateValue)) === 'object') {
          return _extends({}, state, newStateValue);
        }
        // case for simple state slices (numbers, strings etc.)
        return newStateValue;
      }

      // usual multireducer mounting
      var reducer = reducers[actionReducerKey];

      if (reducer) {
        return _extends({}, state, _defineProperty({}, actionReducerKey, reducer(state[actionReducerKey], actionWithoutKey)));
      }
    }

    return state;
  };
}