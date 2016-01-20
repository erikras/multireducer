'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
var wrapMapStateToProps = function wrapMapStateToProps(mapStateToProps, multireducerKey) {
  if (mapStateToProps) {
    if (typeof mapStateToProps !== 'function') {
      throw new Error('mapStateToProps must be a function');
    }
    if (mapStateToProps.length > 2) {
      return function (state, ownProps) {
        return _extends({}, mapStateToProps(multireducerKey, state, ownProps));
      };
    }
    return function (state) {
      return _extends({}, mapStateToProps(multireducerKey, state));
    };
  }
  return function () {
    return {};
  };
};

exports.default = wrapMapStateToProps;