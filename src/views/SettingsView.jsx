import React from 'react';

import { goBack } from '../utils/navUtils';

import NavWrapper from '../components/NavWrapper';
import SettingsForm from '../components/SettingsForm';

import locationStore from '../stores/locationStore';
import locationActions from '../actions/locationActions';


export default class Settings extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.setState({ locationId: '' });
    this.onLocationStoreChange(locationStore.getState());
  }

  componentDidMount() {
    locationStore.listen(this.onLocationStoreChange);
  }

  componentWillUnmount() {
    locationStore.unlisten(this.onLocationStoreChange);
  }

  onLocationStoreChange = (newState) => {
    const { locationId } = newState;
    this.setState({ locationId });
  }

  handleSubmit = (data) => {
    locationActions.update.defer({ resourceType: 'locationSettings', obj: data });
  }

  clearLocalStorage = () => {
    localStorage.removeItem('lat');
    localStorage.removeItem('lng');
    localStorage.removeItem('setupCode');
    localStorage.removeItem('placeName');
    goBack();
  }

  render() {
    return (
      <NavWrapper
        title="Settings"
        leftIcon="back"
        leftAction={this.clearLocalStorage}
      >
        <SettingsForm onSubmit={this.handleSubmit} />
      </NavWrapper>
    );
  }
}
