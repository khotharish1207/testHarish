/*
This store manages:
- auth,
- the User object,
- settings local to the phone such as language and theme/skin.
*/
import alt from '../alt.js';
import { navTo } from '../utils/navUtils';
import appActions from '../actions/appActions';
import bleActions from '../actions/bleActions';
import userSource from '../sources/userSource';
import { auth } from '../neo';

class AppStore {

  static getInitialState() {
    const initialState = { localSettings: null };
    if (localStorage.NSBlocalSettings !== undefined) {
      initialState.localSettings = JSON.parse(localStorage.getItem('NSBlocalSettings'));
    }
    return initialState;
  }

  constructor() {
    this.state = AppStore.getInitialState();
    this.bindActions(appActions);
    this.registerAsync(userSource);
    // register to monitor auth state and auto fetch when it changes
    auth.onAuthStateChanged((userId) => {
      if (!this.state.initialized) {
        appActions.initialize.defer(userId);
      } else if (!userId) {
        // Handle a nullified auth state here, as it may be triggered by manual OR auto-logout
        appActions.authStateNulled.defer();
        this.setState({ user: null });
      }
    });
    // Cordova lifecycle events
    document.addEventListener('deviceready', () => {
      document.addEventListener('backbutton', () => {
        if (confirm('Are you sure you want to quit?')) {
          console.log('disconnectAll');
          bleActions.disconnectAll()
          .then(() => navigator.app.exitApp());
          // While never actually called, I should still manage "catch".
        }
        return false;
      }, false);
      document.addEventListener('pause', () => {
        console.log('app has been paused');
      }, false);
      document.addEventListener('resume', () => {
        console.log('app has been resumed');
      }, false);
    }, false);
  }

  onInitialize(userId) {
    if (!userId) {
      navTo('LoginView');
    } else {
      appActions.fetchUser.defer();
    }
    this.setState({
      userId,
      initialized: true,
    });
  }

  onLogin(userId) {
    this.setState({ userId });
    appActions.fetchUser.defer();
  }

  onRegister(userId) {
    this.setState({ userId });
    appActions.fetchUser.defer();
  }

  onLogout() {
    // This is a user initiated logout so clear settings
    this.setState({ userId: null, locationId: null });
    // Note: authStateNulled will be triggered by onAuthStateChange
  }

  onAuthStateNulled() {
    this.setState({ user: null });
    navTo('LoginView');
  }

  onFetchUser(userId) {
    if (userId) {
      this.setState({ userId });
    }
    this.getInstance().fetchUser();
  }

  onFetchSuccess(user) {
    this.setState({
      user,
      userError: null,
    });
    // Simulate user selecting the location.
    // We currently skip that view and automatically pick location[0]...
    // since for now users only have 1 location.
    appActions.setLocation.defer(Object.keys(user.locations)[0]);
  }

  onFetchError(err) {
    this.setState({
      userError: err,
    });
  }

  onSetLocation(locationId) {
    this.setState({ locationId });
  }
}

export default alt.createStore(AppStore, 'AppStore');
export { AppStore };
