import alt from '../alt';
import { UART_SERVICE, TX_CHARACTERISTIC } from '../utils/bleUtils';
import { Promise } from 'es6-promise';

class BleActions {
  constructor() {
    this.generateActions(
      'initialize', // Used to initiate bluetooth for the app, and sets autoConnect devices.
      'bleStateChange',
      'scan',
      'deviceDiscovered',
      'scanComplete',
      'scanError',
      'startAutoScan',
      'stopAutoScan',
      // 'connect',
      'connectionEstablished',
      'connectionFailed',
      'disconnect',
      'autoConnect',
      'stopAutoConnect',
      'setAutoConnectList',
      'dataReceived',
      'poll',
      'startAutoPoll',
      'stopAutoPoll',
      'startClaim',
      'endClaim',
    );
  }

  writeData({ id, data }) {
    return dispatch => new Promise((resolve, reject) => {
      dispatch({ id, data });
      const timer = setTimeout(reject, 3000, `timeout writing data to ${id}`);
      window.ble.write(id, UART_SERVICE, TX_CHARACTERISTIC, data, () => {
        clearInterval(timer);
        console.log(`wrote ${(new Uint8Array(data))} to ${id}`);
        resolve();
      }, (error) => {
        clearInterval(timer);
        console.error(`error writing data to ${id}`, error);
        reject(error);
      });
    });
  }

  connect(id) {
    return dispatch => new Promise((resolve, reject) => {
      dispatch(id);
      window.ble.connect(id, (peripheral) => {
        setTimeout(this.connectionEstablished(peripheral), 100); // Slight delay...
        resolve(peripheral);
      }, (info) => {
        this.connectionFailed({ id, info });
        reject(info);
      });
    });
  }

  disconnectAll() {
    return dispatch => new Promise((resolve, reject) => {
      dispatch(resolve, reject);
    });
  }

}

export default alt.createActions(BleActions);
export { BleActions };
