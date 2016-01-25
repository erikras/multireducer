'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connectMultireducer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _wrapMapStateToProps = require('./wrapMapStateToProps');

var _wrapMapStateToProps2 = _interopRequireDefault(_wrapMapStateToProps);

var _wrapMapDispatchToProps = require('./wrapMapDispatchToProps');

var _wrapMapDispatchToProps2 = _interopRequireDefault(_wrapMapDispatchToProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Component';
}

function connectMultireducer(mapStateToProps, mapDispatchToProps) {
  for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    rest[_key - 2] = arguments[_key];
  }

  return function (DecoratedComponent) {
    var ConnectMultireducer = function (_Component) {
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

          this.ConnectedComponent = _reactRedux.connect.apply(undefined, [(0, _wrapMapStateToProps2.default)(mapStateToProps, multireducerKey), (0, _wrapMapDispatchToProps2.default)(mapDispatchToProps, multireducerKey)].concat(rest))(DecoratedComponent);
        }
      }, {
        key: 'render',
        value: function render() {
          var ConnectedComponent = this.ConnectedComponent;

          return _react2.default.createElement(ConnectedComponent, this.props);
        }
      }]);

      return ConnectMultireducer;
    }(_react.Component);

    ConnectMultireducer.displayName = 'ConnectMultireducer(' + getDisplayName(DecoratedComponent) + ')';
    ConnectMultireducer.propTypes = {
      multireducerKey: _react.PropTypes.string.isRequired
    };
    ConnectMultireducer.DecoratedComponent = DecoratedComponent;

    return ConnectMultireducer;
  };
}