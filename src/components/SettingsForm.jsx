import React from 'react';
import { Subheader, TextField, RaisedButton, ListItem, Toggle, Divider,
  Dialog, CircularProgress } from 'material-ui';
import IconButton from 'material-ui/IconButton';
import CommunicationLocationOn from 'material-ui/svg-icons/communication/location-on';
import { lightBlueA700 } from 'material-ui/styles/colors';
import axios from 'axios';

import __ from '../utils/i18n';
import { SETUPCODE_VALIDATION, TIMEZONE_REQ,
  INVALID_LOCATION, INVALID_SETUPCODE } from '../constants';

import { navTo } from '../utils/navUtils';
import TimeZoneInput from './TimeZoneInput';
import locationStore from '../stores/locationStore';

export default class SettingsForm extends React.Component {

  componentWillMount() {
    let setUpCode = '';
    let location = '';
    let lat = '';
    let lng = '';
    let onlyShowClaimed = false;
    // let isLocChange = false;
    let disableUpdate = true;

    if (localStorage.setupCode !== undefined) {
      setUpCode = localStorage.getItem('setupCode');
    }

    if (localStorage.placeName !== undefined) {
      location = localStorage.getItem('placeName');
      disableUpdate = false;
    }

    if (localStorage.lat !== undefined) {
      lat = localStorage.getItem('lat');
    }

    if (localStorage.lng !== undefined) {
      lng = localStorage.getItem('lng');
    }

    if (localStorage.onlyShowClaimed !== undefined) {
      const temp = localStorage.getItem('onlyShowClaimed');
      if (temp === 'true') {
        onlyShowClaimed = true;
      }
    }

    this.state = ({
      showAlert: false,
      alertMsg: __('Error in Updating'),
      displayName: { value: '' },
      email: { value: '' },
      setupCode: { value: setUpCode },
      location: { value: location },
      timeZone: { value: '' },
      lat: { value: lat },
      lng: { value: lng },
      onlyShowClaimed,
      isFetchingLocation: false,
      disableUpdate,
    });

    // console.log(lat, lng);
    if (lat && lng) {
      this.handleTimeZone(lat, lng);
    }
    // this.onAppStoreChange(appStore.getState());
    // this.onBleStoreChange(bleStore.getState());
    this.onLocationStoreChange(locationStore.getState());
  }

  clearLocalStorage = () => {
    localStorage.removeItem('lat');
    localStorage.removeItem('lng');
    localStorage.removeItem('setupCode');
    localStorage.removeItem('placeName');
  }

  componentDidMount() {
    // appStore.listen(this.onAppStoreChange);
    // bleStore.listen(this.onBleStoreChange);
    locationStore.listen(this.onLocationStoreChange);
  }

  componentWillUnmount() {
    // appStore.unlisten(this.onAppStoreChange);
    // bleStore.unlisten(this.onBleStoreChange);
    locationStore.unlisten(this.onLocationStoreChange);
  }

  /**
   * Fetch timezone from latitude and longitude.
   */
  handleTimeZone = (lat, long) => {
    const self = this;
    const date = new Date();
    const timestamp = Math.floor(date.getTime() / 1000);

    axios.get(['https://maps.googleapis.com/maps/api/timezone/json?location=',
      lat,
      ',',
      long,
      '&timestamp=',
      timestamp].join(''))
      .then((result) => {
        self.setState({
          timeZone: { value: result.data.timeZoneId,
          },
        });
      })
      .catch(err => console.log(err));
  }

  onAppStoreChange = (newState) => {
    const { user } = newState;
    if (user) {
      this.setState({
        email: { value: user.email },
        displayName: { value: user.displayName },
      });
    }
  }

  onBleStoreChange = (newState) => {
    const { autoScan } = newState;
    this.setState({ autoScan });
  }

  onLocationStoreChange = (newState) => {
    const { location, isFetchingLocation } = newState;

    if (this.state.location.value !== '') {
      const { location, timeZone, setupCode, lat, lng } = this.state;
      this.setState({
        location: { value: location.value },
        setupCode: { value: setupCode.value },
        timeZone: { value: timeZone.value },
        lat: { value: lat.value },
        lng: { value: lng.value },
        isFetchingLocation,
      });
    } else if (location) {
      this.setState({
        location: { value: location.settings.address },
        setupCode: { value: location.settings.setupCode },
        timeZone: { value: location.settings.timeZone },
        lat: { value: location.settings.coordinates.lat },
        lng: { value: location.settings.coordinates.lng },
        isFetchingLocation,
      });
    }
  }

  handleTimezoneChange = (obj) => {
    const value = obj.value;
    this.setState({
      timeZone: { value },
      disableUpdate: false,
    });
  };

  validate() {
    const { setupCode, timeZone, lat, lng, location } = this.state;

    if (setupCode.value.length !== 6 && setupCode.value.length !== 0) {
      setupCode.error = __(SETUPCODE_VALIDATION);
    }

    if (setupCode.value !== '' && /^[0-9a-zA-Z]+$/.test(setupCode.value) === false) {
      setupCode.error = __(INVALID_SETUPCODE);
    }

    if (timeZone.value === '') {
      timeZone.error = __(TIMEZONE_REQ);
    }

    if (lat.value === '' || lng.value === '') {
      location.error = __(INVALID_LOCATION);
    }

    this.setState({ setupCode, location, timeZone });
    return !(setupCode.error || location.error || timeZone.error);
  }

  locationClick = () => {
    const { setupCode, lat, lng } = this.state;
    localStorage.setItem('lat', lat.value);
    localStorage.setItem('lng', lng.value);
    localStorage.setItem('setupCode', setupCode.value);
    navTo('MapView');
    // this.context.router.push('/mapView');
  }

  handleTextChange = field => (event) => {
    const newState = {};
    newState[field] = { value: event.target.value };
    newState['disableUpdate'] = false;
    this.setState(newState);
  }

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.validate()) {
      this.clearLocalStorage();
      this.setState({ disableUpdate: true });
      const { timeZone, setupCode, location, lat, lng } = this.state;
      const locationSettings = {
        address: location.value,
        coordinates: {
          lat: parseFloat(lat.value),
          lng: parseFloat(lng.value),
        },
        timeZone: timeZone.value,
        setupCode: setupCode.value,
      };
      this.props.onSubmit(locationSettings);
    }
  };

  render() {
    const { setupCode, disableUpdate, isFetchingLocation,
      timeZone, location, autoScan, onlyShowClaimed } = this.state;

    return (
      <form onSubmit={this.handleSubmit} style={{ paddingTop: 5 }}>
        {/*
        <Toggle
          label={__('AUTO SCAN')}
          defaultToggled={autoScan}
          onToggle={autoScan ? bleActions.stopAutoScan : bleActions.startAutoScan}
          style={{ padding: '4%' }}
        />
        <Divider />
        */}
        <Toggle
          label={__('SHOW UNCLAIMED BLINDS')}
          defaultToggled={!onlyShowClaimed}
          onToggle={() => {
            this.setState({ onlyShowClaimed: !onlyShowClaimed });
            localStorage.setItem('onlyShowClaimed', !onlyShowClaimed);
          }
          }
          style={{ padding: '4%' }}
        />
        <Divider />
        <br />
        <Subheader> Location Settings </Subheader>
        <ListItem
          disabled
          className="centered box"
        >
          <div className="placeholderLabel"> Location </div>
          <div className={'full-width'}>
            <div style={{ width: '90%', float: 'left', textAlign: 'center' }}>
              <TextField
                className="register-location"
                type="text"
                readOnly
                style={{ width: '90%' }}
                value={location.value}
                onChange={this.handleTextChange('location')}
                onClick={this.locationClick}
                hintText={__('Location')}
                errorText={location.error}
              />
            </div>
            <div style={{ width: '0%', float: 'left' }} >
              <IconButton
                onClick={this.locationClick}
                iconStyle={{ width: 23, height: 23 }}
                style={{ width: 20, height: 40, padding: 0, position: 'absolute' }}
              >
                <CommunicationLocationOn
                  color={lightBlueA700}
                />
              </IconButton>
            </div>
          </div>
        </ListItem>

        <ListItem
          disabled
          className="centered settings-timezone"
        >
          <div>
            <div className="placeholderLabel"> {__('Timezone')} </div>
            <TimeZoneInput
              className="settings-timezone"
              defaultTimeZone={timeZone.value}
              onChange={this.handleTimezoneChange}
              errorText={timeZone.error}
            />
          </div>
        </ListItem>
        { // Temporary setup code removed.
          /*
          <ListItem
          disabled
          className="centered box top-padding"
          >
            <div>
              <div className="placeholderLabel"> Setup code </div>
              <TextField
                type="text"
                style={{ width: '90%' }}
                value={setupCode.value}
                onChange={this.handleTextChange('setupCode')}
                hintText={__('SetUp Code')}
                errorText={setupCode.error}
                maxLength="6"
              />
            </div>
          </ListItem>
        */
        }
        <ListItem
          disabled
          className="centered margin-top-common"
        >
          <RaisedButton
            type="submit"
            style={{ width: '90%' }}
            secondary
            label={isFetchingLocation ? __('Updating Location') : __('Update')}
            disabled={disableUpdate}
          />
        </ListItem>

        {
          isFetchingLocation
          &&
          <Dialog open={isFetchingLocation}>
            <div className="connectingModalContent">
              <CircularProgress />
              <div className="connecting">{ __('Updating Location...')}</div>
            </div>
          </Dialog>
        }
      </form>
    );
  }
}
