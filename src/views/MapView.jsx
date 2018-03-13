import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Gmaps, Marker } from 'react-gmaps';
import { AppBar, IconButton, Dialog, FlatButton } from 'material-ui';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Done from 'material-ui/svg-icons/action/done';
import ActionHighlightOff from 'material-ui/svg-icons/action/highlight-off';

import __ from '../utils/i18n';
import { goBack } from '../utils/navUtils';
import { PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT, NO_RESULTS,
  UNABLE_TO_FETCH } from '../constants';

import LoadingIndicator from '../components/LoadingIndicator';


export default class MapView extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      value: localStorage.getItem('placeName') || '',
      alertMsg: '',
      zoom: 17,
      lat: localStorage.getItem('lat') || 45.5017,
      lng: localStorage.getItem('lng') || -73.5673,
      dragable: true,
      showAlert: false,
      geoLocError: false,
      loading: false,
      isFetchingLocation: true,
    };
  }

  clearLocalLatLng = () => {
    localStorage.removeItem('lat');
    localStorage.removeItem('lng');
    localStorage.removeItem('placeName');
  }

  componentWillUnmount() {
    ReactDOM.findDOMNode(this.refs.input).blur();
  }

  componentDidMount() {
    const input = ReactDOM.findDOMNode(this.refs.input);
    if (navigator.geolocation && !localStorage.getItem('lat')) {
      navigator.geolocation.getCurrentPosition(
        this.handleGeoPosition,
        this.showError,
      );
    }
    const { lat, lng } = this.state;
    !localStorage.getItem('placeName') && this.handleLocation(lat, lng);
    // console.log(lat, lng);
    // this.clearLocalLatLng();
    this.searchBox = new google.maps.places.SearchBox(input);
    this.searchBox.addListener('places_changed', this.placesChangeHandler);
  }

  /**
   * Sets latitude and longitude.
   * @param position
   */
  handleGeoPosition = (position) => {
    this.setState({
      zoom: 15,
      geoLocError: false,
      isFetchingLocation: false,
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  }

  /**
   * Fetches location from the value of lat and lng.
   * @param lat
   * @param lng
   */
  handleLocation = (lat, lng) => {
    const self = this;
    axios.get(['https://maps.googleapis.com/maps/api/geocode/json?latlng=', lat, ',', lng].join(''))
      .then((result) => {
        self.setState({
          value: result.data.results['0'].formatted_address,
          geoLocError: false,
          isFetchingLocation: false,
        });
      })
      .catch(err => {
        console.log(err);
        this.showError({ code: 5 });
      });
  }

  handleAlertDismiss = () => {
    this.setState({ showAlert: false });
  }

  locationChangeHandler = (event) => {
    const value = event.target.value;
    if (!value.trim().length) {
      this.setState({ geoLocError: true });
    }
    this.setState({ value });
  }

  /**
   * Listen to change in location search box.
   * Fetches latitude and longitude for value of location search input box.
   */
  placesChangeHandler = () => {
    const places = this.searchBox.getPlaces();
    const place = ReactDOM.findDOMNode(this.refs.input).value;

    this.setState({
      value: place,
      isFetchingLocation: (place.trim().length > 0),
    });

    if (place.trim().length) {
      if (places.length && places[0].geometry) {
        // console.log(places[0].formatted_address)
        this.setState({
          lat: places[0].geometry.location.lat(),
          lng: places[0].geometry.location.lng(),
          zoom: 17,
          geoLocError: false,
          isFetchingLocation: false,
        });
      } else {
        this.showError({ code: 4 });
      }
    }
  }

  // placesChangeHandler = () => {
  //   const place = ReactDOM.findDOMNode(this.refs.input).value;
  //
  //   this.setState({
  //     value: place,
  //     isFetchingLocation: (place.trim().length > 0),
  //   });
  //
  //   if (place.trim().length) {
  //     if (this.props.placesChangeHandler) {
  //       this.props.placesChangeHandler(this.searchBox.getPlaces());
  //     }
  //     const geocoder = new google.maps.Geocoder();
  //     const self = this;
  //
  //     geocoder.geocode({ address: this.state.value }, (results, status) => {
  //       if (status === google.maps.GeocoderStatus.OK) {
  //         self.setState({
  //           lat: results[0].geometry.location.lat(),
  //           lng: results[0].geometry.location.lng(),
  //           zoom: 15,
  //           geoLocError: false,
  //           isFetchingLocation: false,
  //         });
  //       } else {
  //         let code = 5;
  //         if (status === 'ZERO_RESULTS') { code = 4; }
  //         this.showError({ code });
  //       }
  //     });
  //   }
  // }

  onMapCreated = (map) => {
    this.setState({ isFetchingLocation: false });
    map.setOptions({ disableDefaultUI: false });
  };

  onDragEnd = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    this.setState({
      lat,
      lng,
      geoLocError: false,
      isFetchingLocation: true,
    });
    this.handleLocation(lat, lng);
  };

  onClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    this.setState({
      lat,
      lng,
      geoLocError: false,
      isFetchingLocation: true,
    });
    this.handleLocation(lat, lng);
  };

  setLatLng = () => {
    localStorage.setItem('lat', this.state.lat);
    localStorage.setItem('lng', this.state.lng);
    localStorage.setItem('placeName', this.state.value);
    goBack();
  }

  setMarkerLat = () => {
    return this.state.geoLocError ? null : this.state.lat;
  }

  setMarkerLng = () => {
    return this.state.geoLocError ? null : this.state.lng;
  }

  showError = (error) => {
    this.setState({
      geoLocError: true,
      isFetchingLocation: false,
      // value: '',
    });
    let msg = null;
    switch (error.code) {
      case 1:
        msg = PERMISSION_DENIED + __('Pointing to default location.');
        break;
      case 2:
        msg = POSITION_UNAVAILABLE;
        break;
      case 3:
        msg = TIMEOUT;
        break;
      case 4:
        msg = NO_RESULTS;
        break;
      case 5:
        msg = UNABLE_TO_FETCH;
        break;
      default:
        msg = POSITION_UNAVAILABLE;
        break;
    }
    this.setState({
      alertMsg: msg,
      showAlert: true,
      geoLocError: true,
      value: '',
    });
  }

  render() {
    const { value, lat, lng, zoom, dragable, isFetchingLocation,
      showAlert, alertMsg, geoLocError } = this.state;
    const actions =
      [<FlatButton
        label="Okay"
        primary
        onTouchEnd={this.handleAlertDismiss}
        onMouseUp={this.handleAlertDismiss}
      />];
    const loading = <LoadingIndicator />;

    return (
      <div>
        <AppBar
          title={__('Select location')}
          titleStyle={{ textAlign: 'center' }}
          iconElementLeft={<IconButton onTouchTap={goBack}><ArrowBack /></IconButton>}
          iconElementRight={
            geoLocError
            ?
              <IconButton />
            :
              <IconButton onTouchTap={this.setLatLng}> <Done /> </IconButton>
          }
        />
        <div>
          <input
            ref="input"
            type="text"
            style={{ height: 45, paddingRight: 36 }}
            placeholder={__('Select location')}
            className="form-control"
            value={value}
            onChange={this.locationChangeHandler}
          />
          {
            (value && value.length > 0) &&
            <IconButton
              style={{
                width: 36,
                height: 36,
                padding: 6,
                position: 'absolute',
                top: 55,
                right: 0,
              }}
              onTouchTap={() => this.setState({ value: '', geoLocError: true })}
            >
              <ActionHighlightOff />
            </IconButton>
          }
        </div>

        <Gmaps
          width={'100vw'}
          height={'calc(100vh - 95px)'}
          style={{ textAlign: 'center' }}
          lat={lat}
          lng={lng}
          zoom={zoom}
          loadingMessage={loading}
          params={{ v: '3.exp' }}
          onMapCreated={this.onMapCreated}
          onClick={this.onClick}
        >
          <Marker
            lat={this.setMarkerLat()}
            lng={this.setMarkerLng()}
            draggable={dragable}
            onDragEnd={this.onDragEnd}
          />
        </Gmaps>

        <Dialog actions={actions} open={showAlert}>
          { alertMsg }
        </Dialog>

        { isFetchingLocation && loading }

      </div>
    );
  }
}
