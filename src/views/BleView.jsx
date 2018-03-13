
// This is the main view in the App that lists all the Blinds, both claimed and unclaimed.

import React from 'react';
import { Dialog, FlatButton, List, ListItem, Divider } from 'material-ui';
import _ from 'lodash';

import __ from '../utils/i18n';

import NavWrapper from '../components/NavWrapper';
import UnclaimedBlindListItem from '../components/UnclaimedBlindListItem';
import ClaimedBlindListItem from '../components/ClaimedBlindListItem';
import BlindClaimModal from '../components/BlindClaimModal';
import LoadingIndicator from '../components/LoadingIndicator';

import bleStore from '../stores/bleStore';
import locationStore from '../stores/locationStore';
import bleActions from '../actions/bleActions';


export default class BleView extends React.Component {

  constructor() {
    super();
    this.state = {
      showAlert: false,
      msg: __('The Bluetooth on your device is off, Please enable Bluetooth manually and try to scan again.'),
      integratedList: [],
      secondsElapsed: 60,
      isClaiming: false,
      isFetchingLocation: true,
    };
  }

  componentWillMount() {
    let showUnclaimed = true;
    if (localStorage.onlyShowClaimed !== undefined) {
      const onlyShowClaimed = localStorage.getItem('onlyShowClaimed');
      if (onlyShowClaimed === 'true') {
        showUnclaimed = false;
      }
    }
    this.setState({ showUnclaimed });
    this.onBleStoreChange(bleStore.getState());
    this.onLocationStoreChange(locationStore.getState());
  }

  componentDidMount() {
    bleStore.listen(this.onBleStoreChange);
    locationStore.listen(this.onLocationStoreChange);
  }

  componentWillUnmount() {
    bleStore.unlisten(this.onBleStoreChange);
    locationStore.unlisten(this.onLocationStoreChange);
  }

  /**
   * Listen to bleStore to get unclaimed blinds.
   * Set searched blinds list, device's bluetooth state,
   * is claiming in progress and id of currently claiming device.
   * @param newState
   */
  onBleStoreChange = (newState) => {
    const unclaimed = bleStore.getUnclaimedDevices();
    const { scanResults, devices, scanning, autoScan, bleState, initialized, autoPoll,
      isClaiming, claimDeviceId } = newState;
    this.setState({
      scanResults,
      devices,
      scanning,
      autoScan,
      initialized,
      autoPoll,
      unclaimed,
      isClaiming,
      claimDeviceId,
    });

    if (initialized && bleState === 'off') {
      this.setState({ showAlert: true });
    }
  };

  /**
   * Listen to locationStore to get all claimed blinds.
   * @param newState
   */
  onLocationStoreChange = (newState) => {
    const { isFetchingLocation } = newState;
    const bleBlinds = locationStore.getBleBlinds();
    this.setState({ bleBlinds, isFetchingLocation });
  };

  handleAlertDismiss = () => this.setState({ showAlert: false });

  /**
   * This method returns the list of unclaied blinds.
   * @returns {Array}
   */
  renderUnclaimedDeviceList() {
    let { unclaimed } = this.state;
    unclaimed = _.orderBy(unclaimed, ['signalLevel'], ['desc']);
    if (unclaimed && unclaimed.length > 0) {
      return (
        _.map(unclaimed, item =>
          <UnclaimedBlindListItem
            bleId={item.id}
            connectionState={item.connectionState}
            signalLevel={item.signalLevel}
            bleName={item.name}
            key={item.id}
          />
        )
      );
    }
    return false;
  }

  /**
   * This method returns list of claimed bleBlinds.
   * @returns {*}
   */
  renderClaimedBlindList() {
    let { bleBlinds, unclaimed } = this.state;
    if (bleBlinds && !Object.keys(bleBlinds).length && !Object.keys(unclaimed).length) {
      return (
        <div>
          <ListItem className="none-in-list">
            <p>{__('You have no blinds connected, Please scan devices and connect.')}</p>
          </ListItem>
          <Divider
            inset={false}
          />
        </div>
      );
    }
    bleBlinds = _.orderBy(bleBlinds, [blind => blind.displayName.toLowerCase()], ['asc']);
    return (
      _.map(bleBlinds, (item) => {
        const { id, signalLevel, connectionState, status } = bleStore.getBleInfoFor(item.bleName);
        return (
          <ClaimedBlindListItem
            displayName={item.displayName}
            uid={item.uid}
            bleName={item.bleName}
            favPosition={item.favouritePosition}
            key={item.uid}
            bleId={id}
            signalLevel={signalLevel}
            connectionState={connectionState}
            status={status}
          />
        );
      })
    );
  }

  /**
   * Renders alert dialogue if device bluetooth is OFF.
   * @returns {XML}
   */
  renderbluetoothAlertModal() {
    const { showAlert, msg } = this.state;

    const actions =
      [<FlatButton
        label="Okay"
        primary
        onTouchEnd={this.handleAlertDismiss}
        onMouseUp={this.handleAlertDismiss}
      />];

    return (
      <Dialog
        actions={actions}
        open={showAlert}
      >
        {msg}
      </Dialog>
    );
  }

  render() {
    const { scanning, showUnclaimed, isClaiming, claimDeviceId, isFetchingLocation } = this.state;
    return (
      <NavWrapper
        title={__('Neo Smart Blinds')}
        rightIcon="refresh"
        rightAction={bleActions.scan}
        refreshing={scanning}
      >
        <div
          style={{
            height: 'calc(100vh - 50px)',
            overflow: 'auto',
          }}
        >
          <List style={{ paddingTop: 0 }}>
            {this.renderClaimedBlindList()}
            {showUnclaimed && this.renderUnclaimedDeviceList()}
          </List>
        </div>
        {
          isClaiming &&
            <BlindClaimModal
              open={isClaiming}
              bleId={claimDeviceId}
            />
        }
        {this.renderbluetoothAlertModal()}
        {isFetchingLocation && <LoadingIndicator />}
      </NavWrapper>
    );
  }
}
