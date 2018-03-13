import _ from 'lodash';

import alt from '../alt.js';
import appActions from '../actions/appActions';
import locationActions from '../actions/locationActions';
import locationSource from '../sources/locationSource';
import bleActions from '../actions/bleActions';

class LocationStore {

  constructor() {
    this.state = {
      locationId: null,
      isFetchingLocation: true,
    }; // This will be pulled from location object
    this.bindActions(locationActions);
    this.bindAction(appActions.logout, this.onLogout);
    this.bindAction(appActions.setLocation, this.onSetLocation);
    this.registerAsync(locationSource);
    this.exportPublicMethods({
      getBleBlind: this.getBleBlind,
      getBleBlinds: this.getBleBlinds,
      getBleBlindbyName: this.getBleBlindbyName,
      getBleScenes: this.getBleScenes,
      getScene: this.getScene,
      getNumberOfScheduledScenes: this.getNumberOfScheduledScenes,
      getSchedulesForBleBlinds: this.getSchedulesForBleBlinds,
    });
  }

  getBleBlind(uid) {
    const { location } = this.state;
    if (!location || !location.bleBlinds) {
      return null;
    }
    return _.find(location.bleBlinds, (value, key) => key === uid);
  }

  getScene(sceneId) {
    const { location } = this.state;
    if (!location || !location.scenes) {
      return null;
    }
    return _.find(location.scenes, (value, key) => key === sceneId);
  }

  getBleBlindbyName(bleName) {
    const { location } = this.state;
    if (!location || !location.bleBlinds) {
      return null;
    }
    return _.find(location.bleBlinds, value => value.bleName === bleName);
  }

  getBleBlinds() {
    const { location } = this.state;
    if (!location || !location.bleBlinds) {
      return {};
    }
    return location.bleBlinds;
  }

  getBleScenes() {
    const { location } = this.state;
    if (!location || !location.scenes) {
      return {};
    }
    return location.scenes;
  }

  getNumberOfScheduledScenes() {
    const scenes = this.state.location ? this.state.location.scenes || {} : {};
    let count = 0;
    _.forEach(scenes, (scene) => {
      if (scene.isScheduled) {
        count += 1;
      }
    });
    return count;
  }

  getSchedulesForBleBlinds() {
    const results = {};
    const { location } = this.state;
    if (!location || !location.bleBlinds) {
      return results;
    }
    _.forEach(location.bleBlinds, (bleBlind) => {
      const schedules = [];
      _.forEach(location.scenes, (scene) => {
        const command = scene.bleBlinds[bleBlind.uid];
        if (command !== undefined && command !== null && scene.isScheduled) {
          const { time, days, isRelative, relativeTo, offset } = scene;
          schedules.push({ command, time, days, isRelative, relativeTo, offset });
        }
      });
      results[bleBlind.uid] = schedules;
    });
    return results;
  }

  onFetch() {
    this.setState({ isFetchingLocation: true });
    this.getInstance().fetch();
  }

  onFetchSuccess(results) {
    this.setState({
      location: results,
      error: null,
      isFetchingLocation: false,
    });
    bleActions.setAutoConnectList.defer(_.map(results.bleBlinds, 'bleName'));
  }

  onSyncComplete() {
    this.setState({ unsyncedChanges: false });
  }

  onCreate({ resourceType, obj }) {
    if (resourceType === 'scene') {
      this.setState({ unsyncedChanges: true });
    }
    console.log('creating', JSON.stringify(obj));
    this.getInstance().createResource({ resourceType, obj });
  }

  onUpdate({ resourceType, resourceId, obj }) {
    if (resourceType === 'scene') {
      this.setState({ unsyncedChanges: true });
    }
    this.setState({ isFetchingLocation: true });
    this.getInstance().updateResource({ resourceType, resourceId, obj });
  }

  onRemove({ resourceType, resourceId }) {
    this.getInstance().removeResource({ resourceType, resourceId });
  }

  onCrudError(error) {
    this.setState({ error, isFetchingLocation: false });
  }

  onCrudSuccess() {
    locationActions.fetch.defer();
  }

  onLogout() {
    this.setState({ location: null });
  }

  onSetLocation(locationId) {
    console.log('onSetLocation: ', locationId);
    this.setState({ locationId });
    locationActions.fetch.defer();
  }
}

export default alt.createStore(LocationStore, 'LocationStore');
export { LocationStore };
