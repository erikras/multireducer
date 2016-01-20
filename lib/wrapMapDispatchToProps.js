'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multireducerBindActionCreators = require('./multireducerBindActionCreators');

var _multireducerBindActionCreators2 = _interopRequireDefault(_multireducerBindActionCreators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wrapMapDispatchToProps = function wrapMapDispatchToProps(mapDispatchToProps, multireducerKey) {
  if (mapDispatchToProps) {
    if (typeof mapDispatchToProps === 'function') {
      if (mapDispatchToProps.length > 2) {
        return function (dispatch, ownProps) {
          return _extends({
            dispatch: dispatch
          }, mapDispatchToProps(multireducerKey, dispatch, ownProps));
        };
      }
      return function (dispatch) {
        return _extends({
          dispatch: dispatch
        }, mapDispatchToProps(multireducerKey, dispatch));
      };
    }
    return function (dispatch) {
      return _extends({
        dispatch: dispatch
      }, (0, _multireducerBindActionCreators2.default)(multireducerKey, mapDispatchToProps, dispatch));
    };
  }
  return function (dispatch) {
    return {
      dispatch: dispatch
    };
  };
};

exports.default = wrapMapDispatchToProps;