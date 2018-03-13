import React from 'react';
import { Divider, FlatButton, ListItem } from 'material-ui';

import __ from '../utils/i18n';
import BlindIcon from './BlindIcon';
import Signal from './SignalLevelIndicator';

import bleActions from '../actions/bleActions';


export default class UnclaimedBlindListItem extends React.PureComponent {

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    connectionState: React.PropTypes.string,
    signalLevel: React.PropTypes.number,
    bleId: React.PropTypes.string,
    bleName: React.PropTypes.string,
  };

  startClaim = () => {
    const { bleId } = this.props;
    bleActions.startClaim(bleId);
  }

  renderConnectionInfo = () => {
    let { connectionState, signalLevel, bleName } = this.props;
    if (connectionState !== 'connected' && connectionState !== 'connecting') {
      connectionState = bleName || __('visible');
    }
    signalLevel = signalLevel || 0;
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline' }}>
        <h5>
          {__(`${connectionState.toUpperCase()} | `)}
        </h5>
        <Signal signalLevel={signalLevel} height={14} />
      </div>
    );
  };

  render() {
    const listItemStyle = this.context.muiTheme.listItem;

    return (
      <div>
        <ListItem
          style={listItemStyle}
          disabled
        >
          <div
            className="row roomlistitem align-center"
            style={{ paddingTop: '0px', paddingBottom: '0px', margin: '-8px 0px' }}
          >
            <div className="col-xs-3 vcenter blindPadding">
              <div className="hcenter">
                <BlindIcon
                  style={{ margin: '0 auto' }}
                  percentClosed={0}
                  disabled
                />
              </div>
            </div>
            <div className={'col-xs-7 vcenter'}>
              <h4 className="list-group-control-title">{__('unclaimed')}</h4>

              {this.renderConnectionInfo()}

              <FlatButton
                label={__('Claim this Blind')}
                primary
                onTouchTap={this.startClaim}
              />
            </div>
            <div
              className={'col-xs-2 vcenter list-group-item-right-button'}
              style={{ visibility: 'hidden' }}
            />
          </div>
        </ListItem>
        <Divider />
      </div>
    );
  }
}
