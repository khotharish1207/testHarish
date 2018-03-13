import locationActions from '../actions/locationActions';
import { crud } from '../neo';

const locationSource = {
  fetch: {
    remote(state) {
      const { locationId } = state;
      return crud.fetchResource('location', { locationId });
    },
    local() { return null; },
    success: locationActions.fetchSuccess, // (required) Called with resolve value.
    error: locationActions.crudError, // (required) Called with reject value.
    shouldFetch() { return true; },
  },

  createResource: {
    remote(state, args) {
      const { locationId } = state;
      const { resourceType, obj } = args;
      return crud.createResource(resourceType, obj, { locationId });
    },
    local() { return null; },
    success: locationActions.crudSuccess, // (required) Called with resolve value.
    error: locationActions.crudError, // (required) Called with reject value.
    shouldFetch() { return true; },
  },

  updateResource: {
    remote(state, args) {
      const { locationId } = state;
      const { resourceType, resourceId, obj } = args;
      return crud.updateResource(resourceType, obj, { locationId, resourceId });
    },
    local() { return null; },
    success: locationActions.crudSuccess, // (required) Called with resolve value.
    error: locationActions.crudError, // (required) Called with reject value.
    shouldFetch() { return true; },
  },

  removeResource: {
    remote(state, args) {
      const { locationId } = state;
      const { resourceType, resourceId } = args;
      return crud.removeResource(resourceType, { locationId, resourceId });
    },
    local() { return null; },
    success: locationActions.crudSuccess, // (required) Called with resolve value.
    error: locationActions.crudError, // (required) Called with reject value.
    shouldFetch() { return true; },
  },
};

export default locationSource;
