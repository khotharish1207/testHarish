import React from 'react';
import { Divider, ListItem } from 'material-ui';
import HardwareKeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
// import _ from 'lodash';

import __ from '../utils/i18n';
import { generateCommandHandler } from '../utils/bleUtils';
import { navTo } from '../utils/navUtils';

import BlindRemote from './BlindRemote';
import BlindIcon from './BlindIcon';
import Signal from './SignalLevelIndicator';

// import bleStore from '../stores/bleStore';
import bleActions from '../actions/bleActions';


export default class ClaimedBlindListItem extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    uid: React.PropTypes.string,
    displayName: React.PropTypes.string,
    favPosition: React.PropTypes.number,
    bleId: React.PropTypes.string,
    signalLevel: React.PropTypes.number,
    connectionState: React.PropTypes.string,
    status: React.PropTypes.object, // implemented as an ImmutableJS Map
  };

  shouldComponentUpdate(nextProps) {
    const { displayName, favPosition, signalLevel, connectionState, status } = this.props;
    if (displayName !== nextProps.displayName) {
      return true;
    }
    if (favPosition !== nextProps.favPosition) {
      return true;
    }
    if (signalLevel !== nextProps.signalLevel) {
      console.log('signalLevel');
      return true;
    }
    if (connectionState !== nextProps.connectionState) {
      return true;
    }
    if ((status && !status.equals(nextProps.status)) || (!status && nextProps.status)) {
      console.log('status');
      // note that status is implemented using immutableJS
      return true;
    }
    return false;
  }

  navToBlindDetails = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navTo('BlindDetailsView', this.props.uid);
  }

  goToFavPosition = () => {
    const { bleId, favPosition } = this.props;
    generateCommandHandler(bleId, 'xx', bleActions.writeData)(favPosition);
  };

  renderConnectionInfo = () => {
    const { connectionState, signalLevel } = this.props;
    const {
      text1Color, // green
      text2Color, // red
    } = this.context.muiTheme.palette;
    const color = connectionState === 'connected' ? text1Color : text2Color;
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline' }}>
        <h5 style={{ color }}>
          {__(`${connectionState.toUpperCase()}  |`)}
        </h5>
        <Signal signalLevel={signalLevel} height={14} />
      </div>
    );
  }

  render() {
    const { displayName, bleId, connectionState, status } = this.props;
    const percentClosed = status ? status.get('percentClosed') : null;
    const targetPosition = status ? status.get('targetPosition') : null;
    const targetTime = status ? status.get('targetTime') : null;
    const controlsDisabled = connectionState !== 'connected';
    const listItemStyle = this.context.muiTheme.listItem;
    console.log('Render claimed list item:', displayName);

    return (
      <div>
        <ListItem style={listItemStyle} disabled >
          <div
            className="row roomlistitem align-center"
            style={{ paddingTop: '0px', paddingBottom: '0px', margin: '-8px 0px' }}
          >
            <div className="col-xs-3 vcenter blindPadding">
              <div className="hcenter">
                <BlindIcon
                  style={{ margin: '0 auto' }}
                  percentClosed={percentClosed}
                  targetPosition={targetPosition}
                  targetTime={targetTime}
                  disabled={percentClosed === undefined || percentClosed === null}
                />
              </div>
            </div>
            <div className={'col-xs-7 vcenter'} style={{ padding: 0 }}>
              <h4 className="list-group-control-title">{displayName || __('unnamed')}</h4>

              {this.renderConnectionInfo()}

              <BlindRemote
                className="align-center"
                onOpen={generateCommandHandler(bleId, 'up', bleActions.writeData)}
                onStop={generateCommandHandler(bleId, 'sp', bleActions.writeData)}
                onClose={generateCommandHandler(bleId, 'dn', bleActions.writeData)}
                onFavourite={this.goToFavPosition}
                disableStop={controlsDisabled}
                disableOpen={controlsDisabled}
                disableClose={controlsDisabled}
                disableFavourite={controlsDisabled}
              />
            </div>

            <div
              className="col-xs-2 vcenter list-group-item-right-button"
              onTouchTap={this.navToBlindDetails}
            >
              <HardwareKeyboardArrowRight
                className="right-button"
                color={'#00b7df'}
              />
            </div>
          </div>
        </ListItem>
        <Divider />
      </div>
    );
  }
}
