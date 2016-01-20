'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.multireducerWrapAction = exports.multireducerBindActionCreators = exports.connectMultireducer = undefined;

var _multireducer = require('./multireducer');

var _multireducer2 = _interopRequireDefault(_multireducer);

var _connectMultireducer = require('./connectMultireducer');

var _connectMultireducer2 = _interopRequireDefault(_connectMultireducer);

var _multireducerBindActionCreators = require('./multireducerBindActionCreators');

var _multireducerBindActionCreators2 = _interopRequireDefault(_multireducerBindActionCreators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.connectMultireducer = _connectMultireducer2.default;
exports.multireducerBindActionCreators = _multireducerBindActionCreators2.default;
exports.multireducerWrapAction = _multireducerBindActionCreators.multireducerWrapAction;
exports.default = _multireducer2.default;