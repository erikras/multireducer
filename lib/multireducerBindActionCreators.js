'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

function multireducerWrapAction(action, multireducerKey) {
  var markTypeWitKey = function markTypeWitKey(type) {
    return type + _key2.default + multireducerKey;
  };

  if (action.types) {
    return _extends({}, action, {
      types: action.types.map(markTypeWitKey)
    });
  }
  return _extends({}, action, {
    type: markTypeWitKey(action.type)
  });
}

function multireducerBindActionCreators(multireducerKey, actionCreators, dispatch) {
  var wrappingDispatch = function wrappingDispatch(action) {
    if (typeof action === 'function') {
      var wrappedThunk = function wrappedThunk(globalDispatch, getState) {
        return action(wrappingDispatch, getState, globalDispatch, multireducerKey);
      };
      return dispatch(wrappedThunk);
    } else if ((typeof action === 'undefined' ? 'undefined' : _typeof(action)) === 'object') {
      return dispatch(multireducerWrapAction(action, multireducerKey));
    }
  };

  return (0, _redux.bindActionCreators)(actionCreators, wrappingDispatch);
}