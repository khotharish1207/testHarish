import alt from '../alt';
import { auth } from '../neo';


class AppActions {
  constructor() {
    this.generateActions(
      'initialize',
      'fetchUser',
      'fetchSuccess',
      'fetchError',
      'setLocation',
      'authStateNulled'
    );
  }

  // Requests where a view waits on the outcome before dispatching should go in the actions
  login({ email, password }) {
    return dispatch => auth.login({ email, password })
      .then((userId) => {
        dispatch(userId); // This "dispatches" the action to the store.
      });
  }

  register({ email, password, displayName, locationArgs }) {
    return dispatch => auth.register({ email, password, displayName, locationArgs })
      .then((userId) => {
        dispatch(userId);
      });
  }

  logout() {
    return dispatch => auth.logout()
      .then(() => {
        dispatch();
      });
  }

  recover({ email }) {
    return auth.recover({ email });
  }

  // This is not even needed with Firebase's password reset email...
  // reset({ email, password, token }) {
  //   return auth.confirmPasswordReset(token, password)
  //     .then(() => this.login({ email, password }))
  //     .catch((err) => {
  //       console.error(err); // Firebase Errors have { code, message }
  //       throw err;
  //     });
  // }
}

export default alt.createActions(AppActions);
export { AppActions };
