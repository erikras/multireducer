"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mapValues;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Maps all the values in the given object through the given function and saves them, by key, to a result object
 */
function mapValues(obj, fn) {
  return Object.keys(obj).reduce(function (accumulator, key) {
    return _extends({}, accumulator, _defineProperty({}, key, fn(obj[key], key)));
  }, {});
}