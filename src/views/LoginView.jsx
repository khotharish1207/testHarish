/* globals _VERSION */

import React from 'react';
import { FlatButton, Dialog } from 'material-ui';

import __ from '../utils/i18n';
import { navTo, navCallback } from '../utils/navUtils';
import neoLogo from '../style/img/logos/neo_NEO_white.svg';

import LoginForm from '../components/LoginForm';

import appActions from '../actions/appActions';


export default class LoginView extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.setState({
      showAlert: false,
      alertMsg: __('Error logging in.'),
      loading: false,
    });
  }

  handleSubmit = ({ email, password }) => {
    this.setState({ loading: true });
    appActions.login({ email, password })
      .then(() => navTo('BleView'))
      .catch(err => this.handleError(err));
  }

  handleError = (err) => {
    let msg = __('Invalid Email or Password');
    if (err && err.message) {
      msg = err.message;
    } else {
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
          <img
            src={neoLogo}
            alt="NEO"
            width={200}
          />
          <h2>
            Smart Blinds
            <span style={this.context.muiTheme.invertedViewBlueItalic}>
              Blue
            </span>
          </h2>
          <LoginForm
            onSubmit={this.handleSubmit}
            loading={loading}
          />
          <br />
          <FlatButton
            secondary
            onClick={navCallback('RegisterView')}
            label={__('No Account? Create one.')}
          />
          <br />
          <FlatButton
            secondary
            onClick={navCallback('RecoverView')}
            label={__('Forgot your password?')}
          />
          <br />
          <br />

          <p>{`Version ${_VERSION} | Copyright 2016`}</p>
        </div>
        <Dialog actions={actions} open={showAlert}>
          { alertMsg }
        </Dialog>
      </div>
    );
  }
}
