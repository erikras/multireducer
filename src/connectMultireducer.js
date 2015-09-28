import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import multireducerBind from './multireducerBind';

function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Component';
}

export default function connectMultireducer(mapStateToProps, actions = {}) {
  return DecoratedComponent => {
    class ConnectMultireducer extends Component {
      static displayName = `ConnectMultireducer(${getDisplayName(DecoratedComponent)})`;
      static propTypes = {
        multireducerKey: PropTypes.string.isRequired
      }

      componentWillMount() {
        this.generateConnectedComponent(this.props);
      }

      componentWillReceiveProps(nextProps) {
        if (this.props.multireducerKey !== nextProps.multireducerKey) {
          this.generateConnectedComponent(nextProps);
        }
      }
      static DecoratedComponent = DecoratedComponent;

      generateConnectedComponent({multireducerKey}) {
        this.ConnectedComponent =
          connect(
            state => {
              const slice = state.multireducer[multireducerKey];
              if (!slice) {
                throw new Error(`No state for multireducer key "${multireducerKey}". You initialized multireducer with ${Object.keys(state.multireducer).join(', ')}.`);
              }
              return mapStateToProps ? mapStateToProps(slice) : slice;
            },
            multireducerBind(actions, multireducerKey)
          )(DecoratedComponent);
      }

      render() {
        const {multireducerKey, ...props} = this.props;
        const {ConnectedComponent} = this;
        return <ConnectedComponent {...props}/>;
      }
    }
    return ConnectMultireducer;
  };
}
