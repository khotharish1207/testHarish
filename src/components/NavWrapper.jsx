/* globals _VERSION */
import React from 'react';
import { AppBar, Drawer, IconButton,
  MenuItem, Subheader, FlatButton, Dialog } from 'material-ui';
import { Popover, Overlay } from 'react-bootstrap';
// Icons
import Menu from 'material-ui/svg-icons/navigation/menu';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Warning from 'material-ui/svg-icons/alert/warning';
import Delete from 'material-ui/svg-icons/action/delete';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import Home from 'material-ui/svg-icons/action/home';
import Help from 'material-ui/svg-icons/action/help';
import Settings from 'material-ui/svg-icons/action/settings';
import SettingsRemote from 'material-ui/svg-icons/action/settings-remote';
import Security from 'material-ui/svg-icons/hardware/security';
import Add from 'material-ui/svg-icons/content/add';
import Sync from 'material-ui/svg-icons/notification/sync';
import SupervisorAccount from 'material-ui/svg-icons/action/supervisor-account';
import Alarm from 'material-ui/svg-icons/action/alarm';

import __ from '../utils/i18n';
import { navCallback } from '../utils/navUtils'; 

import appActions from '../actions/appActions';
import locationStore from '../stores/locationStore';
import appStore from '../stores/appStore';

export default class NavWrapper extends React.Component {
  static propTypes = {
    title: React.PropTypes.string,
    leftIcon: React.PropTypes.string,
    rightIcon: React.PropTypes.string,
    leftAction: React.PropTypes.func,
    rightAction: React.PropTypes.func,
    handleTouch: React.PropTypes.func,
    refreshing: React.PropTypes.bool,
    children: React.PropTypes.node,
  };

  static defaultProps = {
    title: 'Title',
    leftIcon: 'menu',
    rightIcon: '',
    leftAction: () => { console.log('Click Left!'); },
    rightAction: () => { console.log('Click Right!'); },
    handleTouch: () => { console.log('handle touch'); },
  };

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  }

  componentWillMount() {
    appStore.listen(this.onAppStoreChange);
    this.onAppStoreChange(appStore.getState());
    this.setState({
      open: false,
      communicationError: false,
      showAlert: false,
      alertMsg: __('No account with this email was found.'),
      loading: false,
      show: false,
    });
    locationStore.listen(this.onLocationStoreChange);
    this.onLocationStoreChange(locationStore.getState());
  }

  componentWillUnmount() {
    appStore.unlisten(this.onAppStoreChange);
    locationStore.unlisten(this.onLocationStoreChange);
  }

  onLocationStoreChange = ({ unsyncedChanges }) => {
    this.setState({ unsyncedChanges });
  }

  onAppStoreChange = (newState) => {
    const state = {};
    if (newState && newState.user) {
      state.userEmail = newState.user.email;
      state.displayName = newState.user.displayName;
    }
    this.setState(state);
  }

  drawerShould = action => () => {
    let state = this.state.open;
    if (action === 'close') {
      state = false;
    } else if (action === 'open') {
      state = true;
    } else {
      state = !state;
    }
    this.setState({ open: state });
  }

  closeAnd = cb => (event) => {
    event.preventDefault();
    this.setState({ open: false });

    if (typeof cb === 'function') {
      setTimeout(cb, 0); // Ensure drawer closed before action ensues.
    }
  }

  handlePasswordReset = (event) => {
    this.setState({ loading: true });
    const email = this.state.userEmail;
    appActions.recover({ email })
      .then(() => {
        this.displayResetAlert();
        this.setState({
          loading: false,
        });
      })
      .catch(err => this.handleError(err));
  }

  displayResetAlert = () => {
    const msg = __('You have been emailed a link to reset your password.');
    this.setState({
      loading: false,
      alertMsg: msg,
      showAlert: true,
    });
  }

  displayHelpAlert = () => {
    const msg = __('Sorry, online help is not yet available.');
    this.setState({
      loading: false,
      alertMsg: msg,
      showAlert: true,
    });
  }

  handleError = (err) => {
    let msg = __('Unable to reset your password at this time.');
    if (err && err.message) {
      msg = err.message;
    }
    this.setState({
      loading: false,
      alertMsg: msg,
      showAlert: true,
    });
  };

  handleAlertDismiss = (event) => {
    event.preventDefault();
    this.setState({
      showAlert: false,
      open: false,
    });
  };

  handleTouchTap = () => {
    this.props.handleTouch();
  };

  renderButtonLeft() {
    if (this.props.leftIcon.toLowerCase() === 'back') {
      return (
        <IconButton onTouchTap={this.props.leftAction}><ArrowBack /></IconButton>
      );
    } else if (this.state.unsyncedChanges) {
      return (
        <IconButton onTouchTap={this.drawerShould('toggle')}><Warning /></IconButton>
      );
    }
    return (
      <IconButton onTouchTap={this.drawerShould('toggle')}><Menu /></IconButton>
    );
  }

  handleClick = e => {
    this.setState({
      target: e.target,
      show: !this.state.show,
    });
  };

  hidePopOver = () => {
    const { show } = this.state;
    if (show) {
      this.setState({ show: !show });
    }
  };


  renderButtonRight() {
    if (this.props.rightIcon.toLowerCase() === 'delete') {
      return (
        <IconButton onTouchTap={this.props.rightAction}><Delete /></IconButton>
      );
    } else if (this.props.rightIcon.toLowerCase() === 'edit') {
      return (
        <IconButton onTouchTap={this.props.rightAction}><ModeEdit /></IconButton>
      );
    } else if (this.props.rightIcon.toLowerCase() === 'refresh') {
      return (
        <IconButton onTouchTap={this.props.rightAction}>
          <Refresh className={this.props.refreshing ? 'spinner' : ''} />
        </IconButton>
      );
    } else if (this.props.rightIcon.toLowerCase() === 'sync') {
      return (
        <IconButton onTouchTap={this.props.rightAction}>
          <Sync />
        </IconButton>
      );
    } else if (this.props.rightIcon.toLowerCase() === 'help') {
      return (
        <div>
          <IconButton onTouchTap={this.handleClick}>
            <Help color="white" />
          </IconButton>

          <Overlay
            show={this.state.show}
            target={this.state.target}
            placement="bottom"
            container={this}
            // rootClose
            // onHide={this.hidePopOver}
            containerPadding={20}
          >
            <Popover
              id="popover-contained"
            >
              <p>
                Scenes allow you to group actions on several blinds together and schedule them.
                Run a scene by pressing the left “play” icon.
                After making changes, you must save schedules to the
                blinds with the “Sync Blinds” button.
              </p>
            </Popover>
          </Overlay>
        </div>
      );
    }

    return <IconButton onTouchTap={this.props.rightAction} />;
  }

  renderUserEmail() {
    const { userEmail, displayName } = this.state;

    // Avoid case when not logged in

    if (userEmail) {
      if (userEmail.length < 32) {
        return (
          <div >
            <p>{displayName} <br /> {userEmail}</p>
          </div>
        );
      }
      const chuncked = userEmail.split('@');
      return (<p>{chuncked[0]}<br />{`@${chuncked[1]}`}</p>);
    }
    return (<p><br />Not logged in.</p>);
  }

  render() {
    const { open, showAlert, alertMsg, loading, unsyncedChanges } = this.state;
    const { muiTheme } = this.context;
    const actions = [
      <FlatButton
        label="Okay"
        primary
        onTouchEnd={this.handleAlertDismiss}
        onMouseUp={this.handleAlertDismiss}
      />,
    ];

    return (
      <div className="fullscreen">
        <AppBar
          title={this.props.title}
          titleStyle={{ textAlign: 'center' }}
          iconElementLeft={this.renderButtonLeft()}
          iconElementRight={this.renderButtonRight()}
          onTitleTouchTap={this.handleTouchTap}
        />
        <Drawer
          open={open}
          docked={false}
          disableSwipeToOpen
          onRequestChange={this.drawerShould('toggle')}
        >
          <div style={muiTheme.drawerHeader}>
            { this.renderUserEmail() }
          </div>
          <Subheader>{__('Navigation')}</Subheader>
          <MenuItem
            leftIcon={<Home />}
            primaryText={__('Blinds')}
            onTouchTap={this.closeAnd(navCallback('BleView'))}
          />
          <MenuItem
            leftIcon={<Alarm />}
            style={unsyncedChanges ? { color: 'red' } : null}
            primaryText={__('Scenes') + (unsyncedChanges ? ` - ${__('Sync Required')}` : '')}
            onTouchTap={this.closeAnd(navCallback('SceneListView'))}
          />
          <Subheader>{__('Configuration')}</Subheader>
          <MenuItem
            leftIcon={<Settings />}
            primaryText={__('Settings')}
            onTouchTap={this.closeAnd(navCallback('SettingsView'))}
          />
          <Subheader>{__('Account')}</Subheader>
          <MenuItem
            disabled={loading}
            leftIcon={<Security />}
            primaryText={__('Reset Password')}
            onTouchTap={this.closeAnd(this.handlePasswordReset)}
          />
          <MenuItem
            leftIcon={<SupervisorAccount />}
            primaryText={__('Logout')}
            onTouchTap={this.closeAnd(appActions.logout)}
          />
          <Subheader>{__('Help')}</Subheader>
          <MenuItem
            leftIcon={<Help />}
            primaryText={__('Help')}
            onTouchTap={this.displayHelpAlert}
          />
          <br />
          <div style={{ textAlign: 'center', fontSize: 12 }}>
            <p>Powered by Neo Smart Blinds</p>
            <p>{`Version ${_VERSION}`}</p>
          </div>
        </Drawer>

        {this.props.children}

        <Dialog actions={actions} open={showAlert}>
          {alertMsg}
        </Dialog>
      </div>
    );
  }
}
