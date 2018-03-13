import React from 'react';
import { TextField, RaisedButton, FlatButton, Dialog } from 'material-ui';
import IconButton from 'material-ui/IconButton';
import CommunicationLocationOn from 'material-ui/svg-icons/communication/location-on';
import { white } from 'material-ui/styles/colors';
import axios from 'axios';

import __ from '../utils/i18n';
import { EMAIL_REQ_VALIDATION, INVALID_EMAIL, PASSWORD_REQUIRED_VALIDATION,
  DISPLAY_NAME_REQUIRED, PASSWORD_LENGTH_VALIDATION, PASSWORDS_DO_NOT_MATCH,
  CONFIRM_PASS_REQ, TIMEZONE_REQ, INVALID_LOCATION, INVALID_SETUPCODE, SETUPCODE_VALIDATION,
  PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT, UNKNOWN_ERROR } from '../constants';

import { navTo } from '../utils/navUtils';

import TimeZoneInput from './TimeZoneInput';


export default class RegisterForm extends React.Component {

  static propTypes = {
    onSubmit: React.PropTypes.func,
    loading: React.PropTypes.bool,
  };

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired,
    history: React.PropTypes.object.isRequired,
  };

  componentWillMount() {
    let displayName = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let setUpCode = '';
    let location = '';
    let lat = '';
    let lng = '';

    if (localStorage.displayName !== undefined) {
      displayName = localStorage.getItem('displayName');
    }

    if (localStorage.accountEmailRegister !== undefined) {
      email = localStorage.getItem('accountEmailRegister');
    }

    if (localStorage.passwordText !== undefined) {
      password = localStorage.getItem('passwordText');
    }

    if (localStorage.confirmPassword !== undefined) {
      confirmPassword = localStorage.getItem('confirmPassword');
    }

    if (localStorage.setupCode !== undefined) {
      setUpCode = localStorage.getItem('setupCode');
    }

    if (localStorage.placeName !== undefined) {
      location = localStorage.getItem('placeName');
    }

    if (localStorage.lat !== undefined) {
      lat = localStorage.getItem('lat');
    }

    if (localStorage.lng !== undefined) {
      lng = localStorage.getItem('lng');
    }

    this.setState({
      showAlert: false,
      alertMsg: __('Error in registering'),
      displayName: { value: displayName },
      email: { value: email },
      password: { value: password },
      confirm: { value: confirmPassword },
      setupCode: { value: setUpCode },
      location: { value: location },
      timeZone: { value: '' },
      lat: { value: lat },
      lng: { value: lng },
    });
  }

  componentDidMount() {
    this.clearLocalStorage();
    const { lat, lng } = this.state;

    if (!lat.value) {
      if (navigator.geolocation) {
        this.getCurrentPosition();
      }
    } else {
      this.handleTimeZone(lat.value, lng.value);
    }
  }

  getCurrentPosition = () => {
    this.handleAlertDismiss();
    navigator.geolocation.getCurrentPosition(
      this.handleGeoPosition,
      this.showError,
      {
        timeout: 10000,
        maximumAge: 10000,
      }
    );
  }

  clearLocalStorage = () => {
    localStorage.removeItem('lat');
    localStorage.removeItem('lng');
    localStorage.removeItem('displayName');
    localStorage.removeItem('accountEmailRegister');
    localStorage.removeItem('passwordText');
    localStorage.removeItem('confirmPassword');
    localStorage.removeItem('setupCode');
    localStorage.removeItem('placeName');
  }

  handleGeoPosition = (position) => {
    this.handleLocation(position.coords.latitude, position.coords.longitude);
  }

  handleAlertDismiss = () => this.setState({ showAlert: false });

  /**
   * Fetches location from the value of latitide and longitude.
   * @param latitide
   * @param longitude
   */
  handleLocation = (lat, long) => {
    const self = this;
    const { location } = this.state;
    axios.get(['https://maps.googleapis.com/maps/api/geocode/json?latlng=', lat, ',', long].join(''))
      .then((result) => {
        self.setState({
          location: { value: location.value || result.data.results['0'].formatted_address },
          lat: { value: lat },
          lng: { value: long },
        });
        self.handleTimeZone(lat, long);
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loading: false,
          alertMsg: __('Unable to fetch address. Kindly check your internet connection'),
          showAlert: true,
        });
      });
  }

  /**
   *  Fetches timezone from the value of latitide and longitude.
   * @param latitide
   * @param longitude
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
      .catch(err => {
        console.log(err);
        this.setState({
          loading: false,
          alertMsg: __('Unable to fetch time zone. Kindly check your internet connection'),
          showAlert: true,
        });
      });
  }

  showError = (error) => {
    let msg = null;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        msg = PERMISSION_DENIED;
        break;
      case error.POSITION_UNAVAILABLE:
        msg = POSITION_UNAVAILABLE;
        break;
      case error.TIMEOUT:
        msg = TIMEOUT;
        break;
      case error.UNKNOWN_ERROR:
        msg = UNKNOWN_ERROR;
        break;
      default:
        msg = POSITION_UNAVAILABLE;
        break;
    }
    this.setState({
      loading: false,
      alertMsg: msg,
      showAlert: true,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.validate()) {
      const { displayName, email, password, timeZone, setupCode, location, lat, lng } = this.state;
      localStorage.setItem('accountEmail', email.value);

      const locationInfo = {
        timeZone: timeZone.value,
        coordinates: {
          lat: parseFloat(lat.value),
          lng: parseFloat(lng.value),
        },
        address: location.value,
        setupCode: setupCode.value,
      };
      // console.log(locationInfo);
      this.props.onSubmit({
        displayName: displayName.value,
        email: email.value,
        password: password.value,
        locationArgs: locationInfo,
      });
    }
  }

  handleTextChange = field => (event) => {
    const newState = {};
    newState[field] = { value: event.target.value };
    this.setState(newState);
  }

  handleTimeZoneChange = (obj) => {
    const value = obj.value;
    this.setState({ timeZone: { value } });
  }

  validate() {
    const { displayName, email, password, confirm,
      setupCode, timeZone, lat, lng, location } = this.state;

    if (email.value === '') {
      email.error = __(EMAIL_REQ_VALIDATION);
    }

    if (email.value !== '' && /\S+@\S+$/.test(email.value) === false) {
      email.error = __(INVALID_EMAIL);
    }

    if (displayName.value === '') {
      displayName.error = __(DISPLAY_NAME_REQUIRED);
    }

    if (password.value === '') {
      password.error = __(PASSWORD_REQUIRED_VALIDATION);
    }

    if (password.value !== '' && password.value.length < 6) {
      password.error = __(PASSWORD_LENGTH_VALIDATION);
    }

    if (setupCode.value.length !== 6 && setupCode.value.length !== 0) {
      setupCode.error = __(SETUPCODE_VALIDATION);
    }

    if (setupCode.value !== '' && /^[0-9a-zA-Z]+$/.test(setupCode.value) === false) {
      setupCode.error = __(INVALID_SETUPCODE);
    }

    if (confirm.value !== password.value) {
      confirm.error = __(PASSWORDS_DO_NOT_MATCH);
    }

    if (confirm.value === '') {
      confirm.error = __(CONFIRM_PASS_REQ);
    }

    if (timeZone.value === '') {
      timeZone.error = __(TIMEZONE_REQ);
    }

    if (lat.value === '' || lng.value === '' || location.value === '') {
      location.error = __(INVALID_LOCATION);
    }

    this.setState({ displayName, email, password, confirm, setupCode });
    return !(email.error || password.error || confirm.error || setupCode.error || location.error);
  }

  handleAlertDismiss = () => this.setState({ showAlert: false });

  locationClick = () => {
    const { displayName, email, password, confirm, setupCode, lat, lng,
      location, timeZone } = this.state;
    localStorage.setItem('displayName', displayName.value);
    localStorage.setItem('accountEmailRegister', email.value);
    localStorage.setItem('passwordText', password.value);
    localStorage.setItem('confirmPassword', confirm.value);
    localStorage.setItem('setupCode', setupCode.value);
    localStorage.setItem('placeName', location.value);
    localStorage.setItem('lat', lat.value);
    localStorage.setItem('lng', lng.value);
    localStorage.setItem('timeZone', timeZone.value);

    navTo('MapView');
    // this.context.router.push('/mapView');
  }

  render() {
    const { displayName, email, password, confirm,
      location, timeZone, showAlert, alertMsg } = this.state;
    const { invertedTextField } = this.context.muiTheme;
    const { loading } = this.props;
    const actions = [
      <FlatButton
        label={__('Retry')}
        primary
        onTouchEnd={this.getCurrentPosition}
      />,
      <FlatButton
        label={__('Okay')}
        primary
        onTouchEnd={this.handleAlertDismiss}
        onMouseUp={this.handleAlertDismiss}
      />,
    ];

    return (
      <form onSubmit={this.handleSubmit} >
        <TextField
          type="text"
          style={{ width: 250 }}
          inputStyle={invertedTextField.inputStyle}
          hintStyle={invertedTextField.hintStyle}
          underlineStyle={invertedTextField.underlineStyle}
          underlineFocusStyle={invertedTextField.underlineFocusStyle}
          value={displayName.value}
          onChange={this.handleTextChange('displayName')}
          hintText={__('Full Name')}
          errorText={displayName.error}
        />
        <br />

        <TextField
          type="email"
          style={{ width: 250 }}
          inputStyle={invertedTextField.inputStyle}
          hintStyle={invertedTextField.hintStyle}
          underlineStyle={invertedTextField.underlineStyle}
          underlineFocusStyle={invertedTextField.underlineFocusStyle}
          value={email.value}
          onChange={this.handleTextChange('email')}
          hintText={__('Email')}
          errorText={email.error}
          maxLength="50"
        />
        <br />
        <TextField
          type="password"
          value={password.value}
          style={{ width: 250 }}
          inputStyle={invertedTextField.inputStyle}
          hintStyle={invertedTextField.hintStyle}
          underlineStyle={invertedTextField.underlineStyle}
          underlineFocusStyle={invertedTextField.underlineFocusStyle}
          onChange={this.handleTextChange('password')}
          hintText={__('Password')}
          errorText={password.error}
          maxLength="25"
        />
        <br />
        <TextField
          type="password"
          style={{ width: 250 }}
          inputStyle={invertedTextField.inputStyle}
          hintStyle={invertedTextField.hintStyle}
          underlineStyle={invertedTextField.underlineStyle}
          underlineFocusStyle={invertedTextField.underlineFocusStyle}
          value={confirm.value}
          onChange={this.handleTextChange('confirm')}
          hintText={__('Confirm Password')}
          errorText={confirm.error}
        />

        <br />
        <div className={'full-width'}>
          <div style={{ width: '96%', float: 'left', textAlign: 'right' }}>
            <TextField
              className="register-location"
              type="text"
              readOnly
              style={{ width: '100%' }}
              inputStyle={invertedTextField.inputStyle}
              hintStyle={invertedTextField.hintStyle}
              underlineStyle={invertedTextField.underlineStyle}
              underlineFocusStyle={invertedTextField.underlineFocusStyle}
              errorStyle={{ textAlign: 'center' }}
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
                color={white}
              />
            </IconButton>
          </div>
        </div>
        <br />
        <TimeZoneInput
          defaultTimeZone={timeZone.value}
          onChange={this.handleTimeZoneChange}
          errorText={timeZone.error}
        />
        <br />
        { // Temporary setup code commented.
          /*
          <TextField
            type="text"
            style={{ width: 250 }}
            inputStyle={invertedTextField.inputStyle}
            hintStyle={invertedTextField.hintStyle}
            underlineStyle={invertedTextField.underlineStyle}
            underlineFocusStyle={invertedTextField.underlineFocusStyle}
            value={setupCode.value}
            onChange={this.handleTextChange('setupCode')}
            hintText={__('SetUp Code')}
            errorText={setupCode.error}
            maxLength="6"
          />
          <br />
          */
        }
        <br />
        <RaisedButton
          type="submit"
          style={{ width: 250 }}
          secondary
          disabled={loading}
          label={__('Register')}
        />
        <br />
        <Dialog actions={actions} open={showAlert}>
          { alertMsg }
        </Dialog>
      </form>
    );
  }
}
