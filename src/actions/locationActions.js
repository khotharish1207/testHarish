import alt from '../alt';

class LocationActions {
  constructor() {
    this.generateActions(
      'fetch',
      'fetchSuccess',
      'create',
      'update',
      'remove',
      'crudError',
      'crudSuccess',
      'syncComplete'
    );
  }
}

export default alt.createActions(LocationActions);
export { LocationActions };
