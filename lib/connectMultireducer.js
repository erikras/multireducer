'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connectMultireducer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _multireducerBind = require('./multireducerBind');

var _multireducerBind2 = _interopRequireDefault(_multireducerBind);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Component';
}

function connectMultireducer(mapStateToProps) {
  var actions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return function (DecoratedComponent) {
    var ConnectMultireducer = (function (_Component) {
      _inherits(ConnectMultireducer, _Component);

      function ConnectMultireducer() {
        _classCallCheck(this, ConnectMultireducer);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ConnectMultireducer).apply(this, arguments));
      }

      _createClass(ConnectMultireducer, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          this.generateConnectedComponent(this.props);
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          if (this.props.multireducerKey !== nextProps.multireducerKey) {
            this.generateConnectedComponent(nextProps);
          }
        }
      }, {
        key: 'generateConnectedComponent',
        value: function generateConnectedComponent(_ref) {
          var multireducerKey = _ref.multireducerKey;

          this.ConnectedComponent = (0, _reactRedux.connect)(function (state, ownProps) {
            var multireducerKeys = Object.keys(state.multireducer);
            if (!multireducerKeys.filter(function (key) {
              return key === multireducerKey;
            })[0]) {
              throw new Error('No state for multireducer key "' + multireducerKey + '". You initialized multireducer with "' + multireducerKeys.join(', ') + '".');
            }
            var slice = state.multireducer[multireducerKey];
            return mapStateToProps ? mapStateToProps(slice, ownProps) : slice;
          }, (0, _multireducerBind2.default)(actions, multireducerKey))(DecoratedComponent);
        }
      }, {
        key: 'render',
        value: function render() {
          var _props = this.props;
          var multireducerKey = _props.multireducerKey;

          var props = _objectWithoutProperties(_props, ['multireducerKey']);

          var ConnectedComponent = this.ConnectedComponent;

          return _react2.default.createElement(ConnectedComponent, props);
        }
      }]);

      return ConnectMultireducer;
    })(_react.Component);

    ConnectMultireducer.displayName = 'ConnectMultireducer(' + getDisplayName(DecoratedComponent) + ')';
    ConnectMultireducer.propTypes = {
      multireducerKey: _react.PropTypes.string.isRequired
    };
    ConnectMultireducer.DecoratedComponent = DecoratedComponent;

    return ConnectMultireducer;
  };
}