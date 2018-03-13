/* globals _VERSION */

import React from 'react';
import { FlatButton, Dialog } from 'material-ui';

import __ from '../utils/i18n';
import { navCallback, navTo } from '../utils/navUtils';

import RegisterForm from '../components/RegisterForm';

import appActions from '../actions/appActions';


export default class RegisterView extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.setState({
      showAlert: false,
      alertMsg: __('Error while Registering'),
      loading: false,
    });
  }

  handleSubmit = (data) => {
    this.setState({ loading: true });
    appActions.register(data)
      .then(() => navTo('BleView'))
      .catch(err => this.handleError(err));
  }

  handleError = (err) => {
    let msg = err.message;
    if (err && err.message) {
      msg = err.message;
    } else {
      console.error(err);
      msg = __('Network Error, Please check internet connenction.');
    }

    this.setState({
      loading: false,
      alertMsg: msg,
      showAlert: true,
    });
  }

  handleAlertDismiss = () => this.setState({ showAlert: false });

  render() {
    const { loading, showAlert, alertMsg } = this.state;
    const actions = [
      <FlatButton
        label={__('Okay')}
        primary
        onTouchEnd={this.handleAlertDismiss}
        onMouseUp={this.handleAlertDismiss}
      />,
    ];
    return (
      <div className="fullscreen flex-container" style={this.context.muiTheme.invertedView}>
        <div className="flex-item centered">
          <h1>{__('Create Account')}</h1>
          <RegisterForm onSubmit={this.handleSubmit} loading={loading} />
          <br />
          <FlatButton
            secondary
            onClick={navCallback('LoginView')}
            label={__('Already have an account?')}
          />
          <br />
          <br />
          <p>{`Version ${_VERSION} | Copyright 2016`}</p>
        </div>
        <Dialog actions={actions} open={showAlert}>
          {alertMsg}
        </Dialog>
      </div>
    );
  }
}
