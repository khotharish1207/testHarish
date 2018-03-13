/* globals _PLATFORM */

// This is a view that gives the user detailed control of the blind.

import React from 'react';
import { FlatButton, Dialog, TextField } from 'material-ui';
import _ from 'lodash';

import __ from '../utils/i18n';
import { generateCommandHandler } from '../utils/bleUtils';
import { goBack, navCallback } from '../utils/navUtils';
import '../style/stylesheets/blindView.css';

import NavWrapper from '../components/NavWrapper';
import BlindRemote from '../components/BlindRemote';
import Battery from '../components/BatteryLevelIndicator';
import Signal from '../components/SignalLevelIndicator';
import BlindTouchControls from '../components/BlindTouchControls';
import FavPositionSlider from '../components/FavPositionSlider';
import AdvancedBleBlindControls from '../components/AdvancedBleBlindControls';

import bleStore from '../stores/bleStore';
import locationStore from '../stores/locationStore';
import locationActions from '../actions/locationActions';
import bleActions from '../actions/bleActions';


export default class BlindDetailsView extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    // Note this.props.params.id refers to bleBlind uid.
    params: React.PropTypes.object.isRequired,
  };

  static defaultProps = {
    params: { id: '123' },
  };

  constructor(props) {
    super(props);
    this.state = {
      blind: null, // details from locationStore.bleBlind[this.props.param]
      device: null, // details from bleStore from device with same bleName
      newName: '', // text field in rename modal
      modalOpen: false,
      modalTypeUnclaim: false,
      favPosition: 0,
      showHelp: false,
      helpMsg: '',
      helpStop: true,
      helpOpen: true,
      helpClose: true,
      helpFavourite: true,
      helpMu: true,
      helpMd: true,
    };
  }

  componentWillMount() {
    const uid = this.props.params.id;
    const blind = locationStore.getBleBlind(uid);
    const bleName = blind && blind.bleName;
    const device = bleStore.getDeviceByName(bleName);
    const favPosition = blind ? blind.favouritePosition : 0;
    this.setState({ blind, device, favPosition });
  }

  componentDidMount() {
    bleStore.listen(this.onBleStoreChange);
    locationStore.listen(this.onLocationStoreChange);
    const { blind } = this.state;
    if (blind && !blind.displayName) {
      this.openRenameModal();
    }
  }

  componentWillUnmount() {
    bleStore.unlisten(this.onBleStoreChange);
    locationStore.unlisten(this.onLocationStoreChange);
  }

  /**
   * Listen to bleStore to get device info by blename.
   */
  onBleStoreChange = () => {
    const { blind } = this.state;
    const bleName = blind && blind.bleName;
    bleName && this.setState({ device: bleStore.getDeviceByName(bleName) });
  }

  /**
   * Listen to locationStore to get blind by uid.
   */
  onLocationStoreChange = () => {
    const uid = this.props.params.id;
    const blind = locationStore.getBleBlind(uid);
    const device = bleStore.getDeviceByName(blind.bleName);
    const favPosition = blind ? blind.favouritePosition : 0;
    this.setState({ blind, favPosition, device });
  }

  unclaimBlind = () => {
    const { device, blind } = this.state;
    const resourceId = this.props.params.id;
    if (blind) { bleActions.stopAutoConnect(blind.bleName); }
    if (device) { bleActions.disconnect(device.id); }
    locationActions.remove({ resourceType: 'bleBlind', resourceId });
    goBack();
  };

  renameBlind = () => {
    const { blind, newName } = this.state;
    const resourceId = this.props.params.id;
    blind.displayName = newName;
    locationActions.update.defer({ resourceType: 'bleBlind', resourceId, obj: blind });
    this.handleCloseModal();
  }

  // UI and modal control

  openRenameModal = () => {
    const { blind } = this.state;
    const newName = blind ? blind.displayName : '';
    this.setState({ modalOpen: true, modalTypeUnclaim: false, newName });
  }

  openUnclaimModal = () => {
    this.setState({ modalOpen: true, modalTypeUnclaim: true });
  };

  handleCloseModal = () => {
    this.setState({ modalOpen: false });
  };

  // Render helpers

  /**
   * Renders status i.e connection info, battery status
   * @returns {XML}
   */

  renderBlindStatus = () => {
    const { device } = this.state;
    const displayBatteryLevel = (device && device.status) ? device.status.get('batteryLevel') : NaN;
    const {
      text1Color, // green
      text2Color, // red
    } = this.context.muiTheme.palette;
    let connectionState = __('Disconnected');
    let signalLevel = 0;
    let color = 'red';
    if (device) {
      connectionState = device.connectionState;
      signalLevel = device.signalLevel;
      color = connectionState === 'connected' ? text1Color : text2Color;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h3
          className="align-center"
          style={{ color }}
        >
          {`${connectionState.toUpperCase()}`}
        </h3>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Battery battery={displayBatteryLevel} disabled={_.isNaN(displayBatteryLevel)} />
          <Signal signalLevel={signalLevel} />
        </div>

      </div>
    );
  }

  /**
   * This method updates the blind's favorite postion the set location.
   */
  handleFavPositionSliderChange = (value) => {
    this.setState({ favPosition: value });
  };

  setFavoritePosition = () => {
    const { blind, favPosition } = this.state;
    const resourceId = this.props.params.id;
    blind.favouritePosition = favPosition;
    locationActions.update.defer({ resourceType: 'bleBlind', resourceId, obj: blind });
  };

  /**
   * This method renders blind rename/unclaim modal as per modalTypeUnclaim value
   * @returns {XML}
   */
  renderModal() {
    const { modalOpen, modalTypeUnclaim, newName } = this.state;
    const actions = [
      <FlatButton
        label={modalTypeUnclaim ? __('Unclaim') : __('Save')}
        primary
        onTouchEnd={modalTypeUnclaim ? this.unclaimBlind : this.renameBlind}
      />,
      <FlatButton
        label="Cancel"
        primary
        onTouchEnd={this.handleCloseModal}
        onMouseUp={this.handleCloseModal}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        open={modalOpen}
        repositionOnUpdate={_PLATFORM === 'android'}
        autoDetectWindowHeight={_PLATFORM === 'android'}
      >
        {
          modalTypeUnclaim
          ?
            __('Unclaim this blind?')
          :
            <TextField
              type="text"
              autoFocus
              style={{ width: '100%' }}
              value={newName}
              onChange={e => this.setState({ newName: e.target.value })}
              floatingLabelText={__('Blind Name')}
              floatingLabelStyle={{ textAlign: 'center' }}
            />
        }
      </Dialog>
    );
  }

  getblindStepupIcon() {
    return { __html: require('!!raw!../style/img/icons/control/stepup.svg') };
  }

  getblindStepdownIcon() {
    return { __html: require('!!raw!../style/img/icons/control/stepdown.svg') };
  }

  /**
   * This method triggers command to move blind to favorite position.
   */
  goToFavPosition = () => {
    const { device, favPosition } = this.state;
    const id = device ? device.id : null;
    generateCommandHandler(id, 'xx', bleActions.writeData)(favPosition);
  };

  showHelp = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      showHelp: true,
      helpMsg: __('Click on a button to learn what it does.'),
    });
  };

  hideHelp = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ showHelp: false });
  };

  /**
   * This method set help message as per command.
   * @param command
   */
  showHelpMsg = cmd => () => {
    let { helpMsg, helpStop, helpOpen, helpClose, helpFavourite, helpMu, helpMd } = this.state;
    helpStop = helpOpen = helpClose = helpFavourite = helpMu = helpMd = true;

    switch (cmd) {
      case 'up':
        helpMsg = __('OPEN - Completely opens the blind.');
        helpOpen = false;
        break;
      case 'dn':
        helpMsg = __('CLOSE - Completely closes the blind.');
        helpClose = false;
        break;
      case 'fv':
        helpMsg = __('FAVORITE - Moves the blind to its favorite position.');
        helpFavourite = false;
        break;
      case 'sp':
        helpMsg = __('STOP - Stops the blind.');
        helpStop = false;
        break;
      case 'mu':
        helpMsg = __('STEP UP - Moves the blind up a small amount.');
        helpMu = false;
        break;
      case 'md':
        helpMsg = __('STEP DOWN - Moves the blind down a small amount.');
        helpMd = false;
        break;
      default: break;
    }
    this.setState({ helpMsg, helpStop, helpOpen, helpClose, helpFavourite, helpMu, helpMd });
  };

  render() {
    const { blind, device, favPosition, showHelp, helpMsg,
      helpStop, helpOpen, helpClose, helpFavourite, helpMu, helpMd } = this.state;
    const id = device ? device.id : null;
    const disabled = !device || !device.status;
    const controlDisable = (device && device.connectionState) ? device.connectionState === 'conncted' : true;
    const status = device ? device.status : null;
    const percentClosed = status ? status.get('percentClosed') : null;
    const targetPosition = status ? status.get('targetPosition') : null;
    const targetTime = status ? status.get('targetTime') : null;

    const remoteButtonSpacing = { margin: '2% 3%' };
    const { remoteControlIcon, blindDetailsView } = this.context.muiTheme;

    return (
      <NavWrapper
        title={blind && blind.displayName && blind.displayName !== '' ? blind.displayName : __('unnamed')}
        leftIcon="back"
        leftAction={navCallback('BleView')}
        rightIcon="delete"
        rightAction={this.openUnclaimModal}
        handleTouch={this.openRenameModal}
      >
        <div style={blindDetailsView}>
          {this.renderBlindStatus()}

          <div style={{ margin: '0 auto' }}>
            <div
              className="swipable"
            >
              <BlindTouchControls
                style={{ margin: '0 auto' }}
                onOpen={generateCommandHandler(id, 'up', bleActions.writeData)}
                onStop={generateCommandHandler(id, 'sp', bleActions.writeData)}
                onClose={generateCommandHandler(id, 'dn', bleActions.writeData)}
                onGoToPosition={generateCommandHandler(id, 'xx', bleActions.writeData)}
                percentClosed={percentClosed}
                targetPosition={targetPosition}
                targetTime={targetTime}
                disabled={disabled}
              />
            </div>
            <FavPositionSlider
              defaultValue={favPosition}
              onChange={this.handleFavPositionSliderChange}
              onDragStop={this.setFavoritePosition}
            />
          </div>
          {
            showHelp
            ?
              <div>
                <BlindRemote
                  buttonSpacing={remoteButtonSpacing}
                  className="align-center"
                  onOpen={this.showHelpMsg('up')}
                  onStop={this.showHelpMsg('sp')}
                  onClose={this.showHelpMsg('dn')}
                  onFavourite={this.showHelpMsg('fv')}
                  helpMsg
                  disableOpen={helpOpen}
                  disableClose={helpClose}
                  disableStop={helpStop}
                  disableFavourite={helpFavourite}
                />
                <div
                  className="align-center"
                  style={{ padding: '0 2%' }}
                >
                  <h4>{helpMsg}</h4>
                </div>
                <div
                  className="micro-steps align-center remote-control-group"
                >
                  <div
                    className="remote-control-mu"
                    style={remoteButtonSpacing}
                    onTouchEnd={this.showHelpMsg('mu')}
                  >
                    <div
                      className={['svg-icon control-icon', (helpMu ? ' disabled' : '')].join('')}
                      dangerouslySetInnerHTML={this.getblindStepupIcon()}
                      style={remoteControlIcon}
                    />
                  </div>
                  <FlatButton
                    label={__('Hide Help')}
                    style={{ width: 'calc(70px + 12%)' }}
                    onClick={this.hideHelp}
                  />
                  <div
                    className="remote-control-md"
                    style={remoteButtonSpacing}
                    onTouchEnd={this.showHelpMsg('md')}
                  >
                    <div
                      className={['svg-icon control-icon', (helpMd ? ' disabled' : '')].join('')}
                      dangerouslySetInnerHTML={this.getblindStepdownIcon()}
                      style={remoteControlIcon}
                    />
                  </div>
                </div>
              </div>
            :
              <div>
                <BlindRemote
                  buttonSpacing={remoteButtonSpacing}
                  className="align-center"
                  onOpen={generateCommandHandler(id, 'up', bleActions.writeData)}
                  onStop={generateCommandHandler(id, 'sp', bleActions.writeData)}
                  onClose={generateCommandHandler(id, 'dn', bleActions.writeData)}
                  onFavourite={this.goToFavPosition}
                  disableStop={controlDisable}
                  disableOpen={controlDisable}
                  disableClose={controlDisable}
                  disableFavourite={controlDisable}
                />
                <div
                  className="micro-steps align-center remote-control-group"
                >
                  <div
                    className="remote-control-mu"
                    style={remoteButtonSpacing}
                    onTouchEnd={controlDisable ? null : generateCommandHandler(id, 'mu', bleActions.writeData)}
                  >
                    <div
                      className={['svg-icon control-icon', (controlDisable ? ' disabled' : '')].join('')}
                      dangerouslySetInnerHTML={this.getblindStepupIcon()}
                      style={remoteControlIcon}
                    />
                  </div>
                  <FlatButton
                    label={__('Help')}
                    style={{ width: 'calc(70px + 12%)' }}
                    onClick={this.showHelp}
                  />
                  <div
                    className="remote-control-open"
                    style={remoteButtonSpacing}
                    onTouchEnd={controlDisable ? null : generateCommandHandler(id, 'md', bleActions.writeData)}
                  >
                    <div
                      className={['svg-icon control-icon', (controlDisable ? ' disabled' : '')].join('')}
                      dangerouslySetInnerHTML={this.getblindStepdownIcon()}
                      style={remoteControlIcon}
                    />
                  </div>
                </div>
              </div>
          }
          <br />

          <AdvancedBleBlindControls disabled={controlDisable} bleId={id} />

          {this.renderModal()}
        </div>
      </NavWrapper>
    );
  }
}
