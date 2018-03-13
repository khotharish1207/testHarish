import appActions from '../actions/appActions';
import { crud } from '../neo';

const userSource = {
  fetchUser: {
    remote(state) {
      const { userId } = state;
      return crud.fetchResource('user', { userId });
    },
    local(/* state, args */) { return null; },
    success: appActions.fetchSuccess, // (required) Called with resolve value.
    error: appActions.fetchError, // (required) Called with reject value.
    shouldFetch(/* state, args */) { return true; },
  },
};

export default userSource;
