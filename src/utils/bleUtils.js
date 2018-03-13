/* eslint no-bitwise: 0 */
import _ from 'lodash';
import Immutable from 'immutable';

// import bleActions from '../actions/bleActions';

function bytesToString(buffer) {
  const array = new Uint8Array(buffer);
  let string = '';
  let temp = '';
  for (let i = 0, l = array.length; i < l; i++) {
    temp = `0${array[i].toString(16)}`;
    temp = temp.slice(-2); // grab last two chars
    string += temp;
    string += ':';
  }
  return string.slice(0, -1);
}

function stringToBytes(string) {
  const split = string.split(':');
  const array = new Uint8Array(split.length);

  for (let i = 0; i < split.length; i++) {
    array[i] = parseInt(split[i], 16);
  }
  // console.log('Converting to bytes' + array[0] + ':' + array[1]);

  return array.buffer;
}

function computeParity(array) {
  let parity = 0;
  for (let i = 0; i < array.length; i++) {
    parity ^= array[i];
  }
  return parity;
}

function cleanAndCategorize(buffer) {
  let array = new Uint8Array(buffer);
  let type = 'unknown';
  if (array[0] === 0x00 && array[1] === 0xff) {
    // Seems that slicing typed arrays is not universally supported
    // array = array.slice(2);
    const numBytes = array.length - 2;
    const temp = new Uint8Array(numBytes);
    for (let i = 0; i < numBytes; i++) {
      temp[i] = array[i + 2];
    }
    array = temp;
  }
  if (array[0] === 0xd8 && array.length === 10) {
    type = 'status';
  }
  return { type, data: array };
}

function computeTargetTime(percentClosed, limitRange, targetPosition, rotationalSpeed) {
  // Compute number of seconds until the blind is expected to reach it's target position
  const s = rotationalSpeed || 0.417; // 25 rpm in rotations per second
  const rotationsClosed = (limitRange * percentClosed) / 100; // convert to rotations
  const targetRotations = (limitRange * targetPosition) / 100;
  return Math.abs(rotationsClosed - targetRotations) / s;
}

function parseStatus(data) {
  const array = data; // Should be Uint8Array
  const status = Immutable.Map({
    batteryLevel: array[4],
    targetPosition: array[5],
    limitRange: array[6],
    percentClosed: array[7],
    running: Boolean(1 & array[8]),
    goingDown: Boolean(2 & array[8]),
    upLimitSet: Boolean(4 & array[8]),
    downLimitSet: Boolean(8 & array[8]),
    touchControl: Boolean(16 & array[8]),
    // bit 5 unused
    pairMode: Boolean(64 & array[8]),
    clockwise: Boolean(128 & array[8]),
    targetTime: computeTargetTime(array[7], array[6], array[5]),
  });
  return status;
}

function computeSignalLevel(rssi) {
  let signalLevel = 0;
  if (isNaN(rssi) || rssi === 127) signalLevel = 0;
  else if (rssi > -60) signalLevel = 5;
  else if (rssi > -70) signalLevel = 4;
  else if (rssi > -80) signalLevel = 3;
  else if (rssi > -90) signalLevel = 2;
  else signalLevel = 1;
  return signalLevel;
}

function generateGoToPositionCommand(target) {
  if (typeof target !== 'number') {
    console.error('xx: target should be a number');
    return null;
  }
  const head = [0x9a];
  const result = [0, 0, 0, 0xdd];
  result.push(Math.min(100, Math.max(0, target)));
  result.push(computeParity(result));
  return head.concat(result);
}

function generateCommandHandler(id, command, cb) {
  return (arg) => {
    let data = null;
    switch (command) {
      case 'up':
        data = [0x9a, 0, 0, 0, 0x0a, 0xdd, 0xd7];
        break;
      case 'dn':
        data = [0x9a, 0, 0, 0, 0x0a, 0xee, 0xe4];
        break;
      case 'sp':
        data = [0x9a, 0, 0, 0, 0x0a, 0xcc, 0xc6];
        break;
      case 'gp':
        data = [0x9a, 0, 0, 0, 0x0a, 0xaa, 0xa0];
        break;
      case 'mu':
        data = [0x9a, 0, 0, 0, 0x0a, 0x0d, 0x07];
        break;
      case 'md':
        data = [0x9a, 0, 0, 0, 0x0a, 0x0e, 0x04];
        break;
      case 'xx':
        data = generateGoToPositionCommand(arg);
        break;
      case 'jg':
        data = [0x85, 0, 0, 0, 0, 0, 0];
        break;
      case 'lu': // set up limit
        data = [0x9a, 0, 0, 0, 0xfa, 0xdd, 0x27];
        break;
      case 'ld': // set down limit
        data = [0x9a, 0, 0, 0, 0xfa, 0xee, 0x14];
        break;
      case 'cu': // move up beyond limit coarsely
        data = [0x9a, 0, 0, 0, 0xfa, 0xd1, 0x2b];
        break;
      case 'cd': // move down beyond limit coarsely
        data = [0x9a, 0, 0, 0, 0xfa, 0xd2, 0x28];
        break;
      case 'fu': // move up beyond limit finely
        data = [0x9a, 0, 0, 0, 0xfa, 0xd3, 0x29];
        break;
      case 'fd': // move down beyond limit finely
        data = [0x9a, 0, 0, 0, 0xfa, 0xd4, 0x2e];
        break;
      case 'rv': // reverse rotation direction
        data = [0x9a, 0, 0, 0, 0xd6, 0x02, 0xd4];
        break;
      case 'lv': // leave channel setting mode
        data = [0x9a, 0, 0, 0, 0xbb, 0xbb, 0];
        break;
      default:
        console.error('bleUtils: unknown command.');
    }
    if (data) {
      data = (new Uint8Array(data)).buffer;
      if (id && cb) {
        // bleActions.writeData({ id, data });
        return cb({ id, data });
      }
      console.error('bleUtils: no device and/or callback provided');
    }
    return null;
  };
}

function daysToByte(days) {
  let result = 0;
  const daysArray = _.map(days.split(''), day => parseInt(day, 10));
  for (let i = 0; i < 7; i++) {
    result += daysArray[i] << (6 - i);
  }
  return result;
}

function relativeTimeFlag(relativeTo, offset) {
  if (relativeTo === 'sunrise') {
    return offset < 0 ? 0x30 : 0x40;
  }
  return offset < 0 ? 0x50 : 0x60;
}

function scheduleToBytes({ command, time, days, isRelative, relativeTo, offset }) {
  const daysConverted = daysToByte(days);
  const hour = isRelative ? relativeTimeFlag(relativeTo, offset) : Math.floor(time / 60);
  const min = isRelative ? Math.min(Math.abs(offset), 255) : time % 60;
  const result = [daysConverted, hour, min, command];
  // console.log(result);
  return result;
}

function formatSchedulesBuffer(schedules) {
  const numSchedules = schedules && schedules.length ? schedules.length : 0;
  let data = [0x88, numSchedules];
  _.map(schedules, (schedule) => {
    data = _.concat(data, scheduleToBytes(schedule));
  });
  // temp
  console.log('schedules', data);
  return (new Uint8Array(data)).buffer;
}

function getCurrentTimeBuffer(TZoffset) {
  const d = new Date(); // for now ignore offset
  const year = d.getFullYear() - 2000; // two digits
  const month = d.getMonth() + 1; // JS does 0-11 so add 1
  const dom = d.getDate(); // Day of month
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();
  const dow = d.getDay(); // Day of the week: 0=sun, 6=sat
  const offset = -Math.round(d.getTimezoneOffset() / 15);
  const data = [0x83, year, month, dom, hour, minute, second, dow, offset];
  console.log('current time', data);
  return (new Uint8Array(data)).buffer;
}

const STATUS_REQUEST = (new Uint8Array([0x9a, 0, 0, 0, 0xcc, 0xcc, 0])).buffer;
const UART_SERVICE = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E'; // Nordic's UART service
const TX_CHARACTERISTIC = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E'; // transmit from the phone's perspective
const RX_CHARACTERISTIC = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';  // receive is from the phone's perspective

export { bytesToString, stringToBytes };
export { generateCommandHandler, parseStatus, cleanAndCategorize, computeSignalLevel };
export { formatSchedulesBuffer, getCurrentTimeBuffer };
export { UART_SERVICE, TX_CHARACTERISTIC, RX_CHARACTERISTIC, STATUS_REQUEST };
