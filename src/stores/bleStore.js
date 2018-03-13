/* globals _PLATFORM */

import _ from 'lodash';

import alt from '../alt.js';
import bleActions from '../actions/bleActions';
import {
  bytesToString,
  parseStatus,
  computeSignalLevel,
  cleanAndCategorize,
  UART_SERVICE,
  RX_CHARACTERISTIC,
  STATUS_REQUEST,
} from '../utils/bleUtils';

class BleStore {

  constructor() {
    this.state = {
      initialized: false,
      bleState: undefined,
      scanResults: {}, // map of latest scan results { id, name, rssi } by id
      devices: {}, // map of connected or connecting devices by id
      // includes { id, name, rssi, connectionState, status... }
      autoConnect: [], // array of device ** names ** to auto connect to
      scanning: false, // is the phone currently scanning
      autoScan: true, // should the phone periodically scan
      autoPoll: true, // should the phone periodically poll the devices
      pollCount: 0,
      pollPending: false,
      isClaiming: false, // is claiming modal open
      claimDeviceId: '', // Devices id which will be claimed
      claimError: false,
    };
    this.bindActions(bleActions);
    this.exportPublicMethods({
      getDeviceByName: this.getDeviceByName,
      getUnclaimedDevices: this.getUnclaimedDevices,
      getBleInfoFor: this.getBleInfoFor,
    });

    document.addEventListener('deviceready', () => {
      bleActions.initialize.defer();
    }, false);
  }

  getDeviceByName(name) {
    return _.find(this.state.devices, value => value.name === name);
  }

  getUnclaimedDevices() {
    // returns the devices that do not have their names in auto connect
    return _.filter(this.state.devices, device => this.state.autoConnect.indexOf(device.name) < 0);
  }

  getBleInfoFor(bleName) {
    const result = _.find(this.state.devices, device => bleName === device.name);
    return result || { name: bleName, rssi: NaN, signalLevel: 0, connectionState: 'disconnected' };
  }

  onStartClaim(id) {
    this.setState({
      isClaiming: true,
      claimDeviceId: id,
      claimError: false,
    });
  }

  onEndClaim() {
    this.setState({
      isClaiming: false,
      claimDeviceId: null,
      claimError: false,
    });
  }

  onInitialize() {
    window.getBleStore = () => this.state;

    // Currently there is a bug with the ble library in the way that it runs on the Developer App.
    // When running on PGDA use this instead of startStateNotifications below.
    // setInterval(() => {
    //   window.ble.isEnabled(() => {
    //     const { bleState } = this.state;
    //     if (bleState !== 'on') {
    //       bleActions.bleStateChange('on');
    //     }
    //   }, () => {
    //     const { bleState } = this.state;
    //     if (bleState !== 'off') {
    //       bleActions.bleStateChange('off');
    //     }
    //   });
    // }, 1000);

    window.ble.startStateNotifications((bleState) => {
      console.log(`Bluetooth state changed to: ${bleState}.`);
      if (bleState === 'on' || bleState === 'off') {
        bleActions.bleStateChange(bleState);
      }
    }, (error) => {
      console.log('Bluetooth state notification error', JSON.stringify(error));
    });

    this.setState({
      initialized: true,
    });
    // bleActions.startAutoScan.defer();
    // bleActions.startAutoPoll.defer();
    setInterval(() => {
      if (this.state.autoPoll) {
        bleActions.poll.defer();
      }
    }, 1500);

    console.log('initialized.');
  }

  onBleStateChange(bleState) {
    console.log('Bluetooth state changed:', bleState);
    if (bleState === 'on' && this.state.autoScan) {
      bleActions.scan.defer();
    }
    this.setState({ bleState });
  }

  onSetAutoConnectList(bleNames) {
    if (bleNames instanceof Array) {
      console.log('set auto connect list:', bleNames);
      this.setState({ autoConnect: bleNames });
    }
  }

  onAutoConnect(bleName) {
    this.state.autoConnect.push(bleName);
  }

  onStopAutoConnect(bleName) {
    _.remove(this.state.autoConnect, i => i === bleName);
  }

  onScan() {
    if (this.state.scanning) {
      console.log('Busy, already scanning...');
    } else if (this.state.bleState !== 'on') {
      console.log('Can not scan, BLE not on');
    } else {
      const devices = [];
      this.setState({ scanning: true });
      console.log('Starting scan...');
      window.ble.startScan([UART_SERVICE], (device) => {
        devices.push(device.id);
        bleActions.deviceDiscovered({
          id: device.id,
          name: device.name,
          rssi: device.rssi,
        });
      }, (error) => {
        console.error('scan error!');
      });
      setTimeout(window.ble.stopScan, 3000, () => {
        console.log('Scan complete.');
        bleActions.scanComplete(devices);
      }, () => {
        console.error('stop scan error!');
      });
    }
  }

  onDeviceDiscovered({ id, name, rssi }) {
    console.log(`scan found: ${name} - ${id}`);
    if (name.startsWith('NEO')) {
      const { devices, autoConnect } = this.state;
      const signalLevel = computeSignalLevel(rssi);
      devices[id] = { id, name, rssi, signalLevel, connectionState: 'visible' };
      this.emitChange();
      if (autoConnect.indexOf(name) >= 0) {
        bleActions.connect.defer(id);
      }
    }
  }

  onScanComplete(deviceIdsFound) {
    // Need to purge the list of devices that are no longer visible
    const { devices } = this.state;
    for (const id of Object.keys(devices)) {
      if (devices[id].connectionState === 'visible' && deviceIdsFound.indexOf(id) < 0) {
        console.log(`no longer visible: ${id}`);
        delete devices[id];
      }
    }
    this.setState({ scanning: false });
    if (this.state.autoScan) {
      setTimeout(bleActions.scan, 3000);
    }
  }

  onScanError(scanError) {
    this.setState({
      scanError,
      scanning: false,
    });
    if (this.state.autoScan) {
      setTimeout(bleActions.scan, 5000);
    }
  }

  onStartAutoScan() {
    this.setState({ autoScan: true });
    bleActions.scan.defer();
  }

  onStopAutoScan() {
    this.setState({ autoScan: false });
  }

  onConnect(id) {
    const { devices } = this.state;
    console.log(`connecting: ${id}`);
    const connectionState = 'connecting';
    if (devices[id]) {
      devices[id].connectionState = connectionState;
    } else {
      // console.warning(`device not visible prior to connection: ${id}`);
      devices[id] = { id, connectionState };
    }
    this.emitChange();
  }

  onConnectionEstablished({ id, name, rssi }) {
    const { devices, isClaiming, claimDeviceId } = this.state;
    // Start Notifications
    devices[id] = { id, name, rssi, connectionState: 'connected' };
    this.emitChange();
    window.ble.startNotification(id, UART_SERVICE, RX_CHARACTERISTIC, (rawData) => {
      bleActions.dataReceived({ id, rawData });
    }, (error) => {
      console.log(`Notifications failed, disconnecting. Error: ${error}`);
      setTimeout(bleActions.disconnect(id), 100); // See if timeout helps this
      if (isClaiming && claimDeviceId === id) {
        this.setState({ claimError: true });
      }
    });
    console.log(`connection established with ${name}.`);
  }

  onConnectionFailed({ id, info }) {
    const { devices, isClaiming, claimDeviceId } = this.state;
    delete devices[id];
    if (isClaiming && claimDeviceId === id) {
      this.setState({ claimError: true });
    }
    this.emitChange();
    console.log(`connection to ${id} failed}`);
    console.log(JSON.stringify(info));
  }

  onDataReceived({ id, rawData }) {
    const { devices } = this.state;
    console.log(`raw data: ${bytesToString(rawData)} from: ${id}`);
    if (devices[id]) {
      devices[id].lastUpdate = Date.now();
      devices[id].rawData = bytesToString(rawData);
      const { data, type } = cleanAndCategorize(rawData);
      switch (type) {
        case 'status':
          devices[id].status = parseStatus(data);
          console.log(`status update from: ${id}`);
          break;
        default:
          console.warn(`unreconized data format from: ${id}`);
      }
      this.emitChange();
    } else {
      console.log(`Data received from unknown device: ${id}`);
    }
  }

  onDisconnect(id) {
    const { devices } = this.state;
    window.ble.disconnect(id, () => {
      // The success callback appears to be called even if the device was already disconnected
      delete devices[id];
      console.log(`Disconnect success: ${id}`);
      this.emitChange();
    }, () => {
      console.log(`Disconnect Failed! ${id}`);
    });
  }

  onDisconnectAll(resolve, reject) {
    const { devices } = this.state;
    const devicesToDisconnect = _.filter(devices, device =>
      device.connectionState === 'connected');
    let i = 0;

    const disconnect = () => {
      const { id } = devicesToDisconnect[i];
      i += 1;
      window.ble.disconnect(id, () => {
        delete devices[id];
        console.log(`Disconnect success: ${id}`);
        // setTimeout(next, 100);
        next();
      }, () => {
        console.log(`Disconnect Failed! ${id}`);
        // setTimeout(next, 100);
        next();
      });
    };

    const next = () => {
      if (devicesToDisconnect.length > i) {
        disconnect();
      } else {
        resolve(); // Take a hot sec before returning...
      }
    };

    next();
  }

  onWriteData({ id, data }) {
    // nothing needed, completely handled by action.
  }

  onPoll() {
    const { pollCount, devices, pollPending } = this.state;
    const devicesToPoll = _.filter(devices, device => device.connectionState === 'connected');
    const n = devicesToPoll.length;
    if (n > 0 && !pollPending) {
      const i = pollCount % n;
      const device = devicesToPoll[i];
      this.setState({ pollPending: true, pollCount: pollCount + 1 });
      console.log(`Polling: ${device.id}, pollCount: ${pollCount}`);
      window.ble.readRSSI(device.id, (rssi) => {
        if (devices[device.id]) {
          if (rssi !== 127) {
            // Ignore 127 value.
            devices[device.id].rssi = rssi;
            devices[device.id].signalLevel = computeSignalLevel(rssi);
          }
          // Added this code snippet to work with mock-motor.
          // bleActions.writeData.defer({
          //   id: device.id,
          //   data: STATUS_REQUEST,
          // });
        } else {
          console.warn(`Device ${device.id} disconnected during polling.`);
        }
        this.setState({ pollPending: false });
      }, () => {
        console.warn(`Failed to read rssi for ${device.id}`);
        this.setState({ pollPending: false });
      });
    } else if (pollPending) {
      console.warn('Still polling...');
    } else if (n === 0) {
      console.log('No devices to poll.');
    }
  }

  // onPoll(id) {
  //   const { devices } = this.state;
  //   const devicesToPoll = id ? [{ id }] : _.filter(devices, device =>
  //     device.connectionState === 'connected');
  //   console.log(`${devicesToPoll.length} devices to poll`);

  //   /* "synchronous" poll to avoid errors on Android caused from reading multiple RSSIs
  //   at the same time */

  //   let i = 0;

  //   const poll = () => {
  //     const device = devicesToPoll[i];
  //     i += 1;
  //     console.log(`polling ${device.id}`);
  //     window.ble.isConnected(device.id, () => {
  //       // Device Connected
  //       console.log(`${device.id} is connected`);
  //       // bleActions.writeData.defer({
  //       //   id: device.id,
  //       //   data: STATUS_REQUEST,
  //       // });
  //       next();
  //       // window.ble.readRSSI(device.id, (rssi) => {
  //       //   // updated rssi
  //       //   devices[device.id].rssi = rssi;
  //       //   next();
  //       // }, () => {
  //       //   // rssi read failed
  //       //   console.warn(`Failed to read rssi for ${device.id}`);
  //       //   next();
  //       // });
  //     }, () => {
  //       // not connected
  //       console.error(`Not connected to ${device.id}`);
  //       next();
  //     });
  //   };

  //   const next = () => {
  //     if (devicesToPoll.length > i) {
  //       poll();
  //     } else if (this.state.autoPoll && !this.state.pollPending) {
  //       this.setState({ pollPending: true });
  //       setTimeout(() => {
  //         bleActions.poll.defer();
  //         this.setState({ pollPending: false });
  //       }, 2000);
  //     }
  //   };
  //   next();
  // }

  onStartAutoPoll() {
    console.log('started auto poll');
    this.setState({ autoPoll: true });
    // bleActions.poll.defer();
  }

  onStopAutoPoll() {
    this.setState({ autoPoll: false });
  }
}

export default alt.createStore(BleStore, 'BleStore');
export { BleStore };
