import React from 'react';
import { Dialog, FlatButton } from 'material-ui';
import _ from 'lodash';

import __ from '../utils/i18n';
import { generateCommandHandler } from '../utils/bleUtils';

import bleStore from '../stores/bleStore';
import bleActions from '../actions/bleActions';
import locationStore from '../stores/locationStore';


export default class SceneRunModal extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    open: React.PropTypes.bool,
    sceneName: React.PropTypes.string,
    closeSceneModal: React.PropTypes.func,
    runningLists: React.PropTypes.object,
  };

  static defaultProps = {
    open: false,
    title: __('Default'),
  };

  constructor() {
    super();
    this.state = {
      open: false,
    };
  }

  componentWillMount() {
    const { devices } = bleStore.getState();
    const bleBlinds = locationStore.getBleBlinds();
    const bleBlindInfoList = {};

    _.map(bleBlinds, (val, key) => {
      bleBlindInfoList[key] = {
        device: _.find(devices, item => val.bleName === item.name),
        displayName: val.displayName,
      } || {};
    });

    this.setState({ bleBlindInfoList });
  }

  componentDidMount() {
    setTimeout(() => this.props.closeSceneModal(), 3000);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ open: nextProps.open });
  }

  getRunnnigBlindsList = () => {
    const { runningLists } = this.props;
    const { bleBlindInfoList } = this.state;
    const {
      text1Color, // green
      text2Color, // red
    } = this.context.muiTheme.palette;

    return _.map(bleBlindInfoList, (item, key) => {
      const isInRunningListAndConnected = runningLists.hasOwnProperty(key) && item.device && item.device.connectionState === 'connected';
      const status = !runningLists.hasOwnProperty(key) ? __('Not Included') : __('Disconnected');

      if (isInRunningListAndConnected) {
        generateCommandHandler(item.device.id, 'xx', bleActions.writeData)(runningLists[key]);
        return (
          <div key={key}>
            <div className="sceneBlindList" >{`${item.displayName}`}</div>
            <div className="sceneBlindList" style={{ color: text1Color }}>{__('Sent')}</div>
          </div>
        );
      }
      return (
        <div key={key}>
          <div className="sceneBlindList" >{`${item.displayName}`}</div>
          <div className="sceneBlindList" style={{ color: text2Color }}>{`${status}`}</div>
        </div>
      );
    });
  };

  handleModalDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.closeSceneModal();
  };

  render() {
    const { open, sceneName } = this.props;

    const actions = [
      <FlatButton
        label="Close"
        primary
        onTouchTap={this.handleModalDismiss}
      />,
    ];

    return (
      <Dialog
        open={open}
        title={__('Running Scene')}
        titleClassName="hcenter"
        modal
        autoScrollBodyContent
      >
        <div className="centered">
          <h4>{sceneName}</h4>
          <div>
            {this.getRunnnigBlindsList()}
          </div>
          <br />
        </div>
      </Dialog>
    );
  }
}
