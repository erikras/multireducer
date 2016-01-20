'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.multireducerWrapAction = multireducerWrapAction;
exports.default = multireducerBindActionCreators;

var _key = require('./key');

var _key2 = _interopRequireDefault(_key);

var _redux = require('redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function multireducerWrapAction(action, multireducerKey) {
  if (action.types) {
    return _extends({}, action, {
      types: action.types.map(function (type) {
        return type + _key2.default + multireducerKey;
      })
    });
  }
  return _extends({}, action, {
    type: action.type + _key2.default + multireducerKey
  });
}

function multireducerBindActionCreators(multireducerKey, actionCreators, dispatch) {
  var wrappingDispatch = function wrappingDispatch(action) {
    if (typeof action === 'function') {
      var wrappedThunk = function wrappedThunk(ignoredDispatch, getState) {
        return action(wrappingDispatch, getState, ignoredDispatch);
      };
      return dispatch(wrappedThunk);
    } else if ((typeof action === 'undefined' ? 'undefined' : _typeof(action)) === 'object') {
      return dispatch(multireducerWrapAction(action, multireducerKey));
    }
  };

  return (0, _redux.bindActionCreators)(actionCreators, wrappingDispatch);
}