/* globals _VERSION */

import React from 'react';
import { FlatButton, Dialog } from 'material-ui';

import __ from '../utils/i18n';
import { navTo, navCallback } from '../utils/navUtils';
import neoLogo from '../style/img/logos/neo_NEO_white.svg';

import RecoverForm from '../components/RecoverForm';

import appActions from '../actions/appActions';


export default class RecoverView extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.setState({
      showAlert: false,
      alertMsg: __('No account with this email was found.'),
      isLinkSent: false,
    });
  }

  handleSubmit = ({ email }) => {
    this.setState({ loading: true });
    appActions.recover({ email })
      .then(() => {
        this.gotoLogin();

        this.setState({
          loading: false,
          isLinkSent: true,
        });
      })
      .catch(err => this.handleError(err));
  }

  gotoLogin = () => {
    const msg = __('Reset password link is sent to email, please login again by changing password.');
    this.setState({
      loading: false,
      alertMsg: msg,
      showAlert: true,
    });
  }

  handleError = (err) => {
    let msg = __('Invalid Email or Token');
    if (err && err.message) {
      msg = err.message;
    }
    this.setState({
      loading: false,
      alertMsg: msg,
      showAlert: true,
    });
  }

  handleAlertDismiss = (event) => {
    event.preventDefault();
    this.setState({ showAlert: false });
    const { isLinkSent } = this.state;

    if (isLinkSent) {
      navTo('LoginView');
    }
  }

  render() {
    const { showAlert, alertMsg, loading } = this.state;
    const actions = [
      <FlatButton
        label={__('Okay')}
        primary
        onTouchEnd={this.handleAlertDismiss}
        onMouseUp={this.handleAlertDismiss}
      />,
    ];
    return (
      <div
        className="fullscreen flex-container"
        style={this.context.muiTheme.invertedView}
      >
        <div className="flex-item centered">
          <img
            src={neoLogo}
            alt="NEO"
            width={200}
          />
          <h2>Smart Blinds <span style={this.context.muiTheme.invertedViewBlueItalic}>Blue</span></h2>

          <RecoverForm
            onSubmit={this.handleSubmit}
            loading={loading}
          />
          <br />
          <FlatButton
            secondary
            onClick={navCallback('LoginView')}
            label={__('Wait, I remember! Let me login.')}
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
