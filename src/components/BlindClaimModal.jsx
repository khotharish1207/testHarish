import React from 'react';
import { Dialog, FlatButton, CircularProgress } from 'material-ui';

import __ from '../utils/i18n';
import neoLogo from '../style/img/gifs/blind/bofu_p_button.gif';
import { generateCommandHandler } from '../utils/bleUtils';
import { navTo } from '../utils/navUtils';

import bleStore from '../stores/bleStore';
import locationActions from '../actions/locationActions';
import locationStore from '../stores/locationStore';
import bleActions from '../actions/bleActions';


export default class BlindClaimModal extends React.Component {

  static propTypes = {
    open: React.PropTypes.bool,
    bleId: React.PropTypes.string,
  };

  static defaultProps = {
    open: false,
    bleId: '123',
  };

  componentWillMount() {
    const { bleId } = this.props;
    this.setState({
      secondsRemaining: 60,
      claimError: false,
      errorMsg: __('Connection to device failed, try claiming the device again.'),
      savingBlind: false,
    });
    bleActions.connect(bleId)
    .then(() => {
      this.interval = setInterval(this.tick.bind(this), 1000);
    });
  }

  componentDidMount() {
    locationStore.listen(this.onLocationStoreChange);
    bleStore.listen(this.onBleStoreChange);
    this.onBleStoreChange(bleStore.getState());
  }

  componentWillUnmount() {
    bleStore.unlisten(this.onBleStoreChange);
    locationStore.unlisten(this.onLocationStoreChange);
    clearInterval(this.interval);
  }

  onLocationStoreChange = () => {
    const { bleId } = this.props;
    const device = bleStore.getState().devices[bleId];
    const bleBlind = locationStore.getBleBlindbyName(device.name);
    if (bleBlind) {
      bleActions.endClaim.defer(); // Always need to defer actions in store listeners
      const uid = bleBlind.uid;
      navTo('BlindDetailsView', uid);
    }
  }

  /**
   * Listen to bleStore to get the state of connecting blind.
   * Blind will be added to claimed blinds when status.pairMode = true.
   * @param newState
   */
  onBleStoreChange = (newState) => {
    const { claimError, devices } = newState;
    const { bleId } = this.props;
    const { savingBlind } = this.state;
    const device = devices[bleId];
    this.setState({ claimError });

    if (device) {
      const { connectionState, status, name } = device;
      this.setState({ connectionState });
      if (!savingBlind && status && status.get('pairMode')) {
        this.claimThisBlind(name);
      }
    }
  };

  /**
   * Claims the blind and save blind to Location store
   * Saves blind to Firebase location store using locationActions.create()
   */
  claimThisBlind = (bleName) => {
    clearInterval(this.interval);
    this.setState({
      savingBlind: true,
    });
    const bleBlind = {
      displayName: '',
      bleName: bleName || '',
      favouritePosition: 50,
    };
    generateCommandHandler(this.props.bleId, 'lv', bleActions.writeData.defer)();
    locationActions.create.defer({ resourceType: 'bleBlind', obj: bleBlind });
  }

  disconnectBlind = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const { bleId } = this.props;
    bleActions.disconnect(bleId);
    bleActions.endClaim();
  }

  tick = () => {
    let { secondsRemaining } = this.state;
    secondsRemaining -= 1;
    this.setState({ secondsRemaining });
    if (secondsRemaining < 1) {
      clearInterval(this.interval);
      // want to run one more scan/poll cycle before giving up.
      this.timeout = setTimeout(() => {
        this.disconnectBlind();
      }, 3000);
    }
  };

  /**
   * render action buttons for Claiming modal, Error modal
   * and connecting dialog.
   * @returns {*}
   */
  renderModalActions = () => {
    const { connectionState, claimError, savingBlind } = this.state;
    const { bleId } = this.props;

    const claimActions = [
      <FlatButton
        label={__('Indentify Blind')}
        primary
        disabled={savingBlind}
        onTouchTap={generateCommandHandler(bleId, 'jg', bleActions.writeData)}
      />,
      <FlatButton
        label="Cancel"
        onTouchTap={this.disconnectBlind}
      />,
    ];

    const errorActions = [
      <FlatButton
        label="Ok"
        primary
        onTouchTap={this.disconnectBlind}
      />,
    ];

    if (claimError) {
      return errorActions;
    } else if (connectionState === 'connected') {
      return claimActions;
    }
    return null;
  }

  /**
   * Renders the modal content for claiming modal, Device disconnect error modal
   * and connecting modal.
   * Displayed the connecting dialog when device is connecting.
   * Displayed error message on device disconnect.
   * @returns {XML}
   */
  renderModalContent = () => {
    const { secondsRemaining, savingBlind, connectionState, claimError, errorMsg } = this.state;
    if (claimError) {
      return (
        <div> {errorMsg}</div>
      );
    } else if (savingBlind) {
      return (
        <div className="connectingModalContent">
          <CircularProgress />
          <div className="connecting"> Saving Blind... </div>
        </div>
      );
    } else if (connectionState === 'connected') {
      return (
        <div
          style={{ textAlign: 'center' }}
        >
          <div>
            {__('Press and hold the small button on the side of the blind until it jogs.')}
          </div>
          <br />
          <div>
            <img
              src={neoLogo}
              alt="NEO"
              style={{ width: '100%' }}
            />
          </div>
          <br />
          <div>
            {__('Time Remaining')}: {secondsRemaining}
          </div>
        </div>
      );
    }
    // This should only happen initially.
    return (
      <div className="connectingModalContent">
        <CircularProgress />
        <div className="connecting"> Connecting... </div>
      </div>
    );
  }

  render() {
    const { open } = this.props;
    return (
      <Dialog
        actions={this.renderModalActions()}
        open={open}
        modal
        autoScrollBodyContent
      >
        {this.renderModalContent()}
      </Dialog>
    );
  }
}
