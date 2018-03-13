import React from 'react';
import { Dialog, FlatButton, RefreshIndicator } from 'material-ui';
import _ from 'lodash';

import __ from '../utils/i18n';
import { formatSchedulesBuffer, getCurrentTimeBuffer } from '../utils/bleUtils';

import locationStore from '../stores/locationStore';
import locationActions from '../actions/locationActions';
import bleStore from '../stores/bleStore';
import bleActions from '../actions/bleActions';


export default class SceneSyncModal extends React.Component {

  static propTypes = {
    open: React.PropTypes.bool,
    closeSceneModal: React.PropTypes.func,
  };

  static defaultProps = {
    open: false,
    closeSceneModal: () => {},
  };

  constructor() {
    super();
    this.state = {
      open: false,
      bleBlinds: locationStore.getBleBlinds(),
      schedulesMap: locationStore.getSchedulesForBleBlinds(),
      progressMap: {},
    };
  }

  componentDidMount() {
    const { schedulesMap, bleBlinds, progressMap } = this.state;
    const numBlinds = Object.keys(schedulesMap).length;
    let count = 0;
    _.map(schedulesMap, (schedules, bleBlindUid) => {
      const bleInfo = bleStore.getBleInfoFor(bleBlinds[bleBlindUid].bleName);
      // console.log('bleInfo', JSON.stringify(bleInfo));
      bleActions.writeData({ id: bleInfo.id, data: getCurrentTimeBuffer() })
      .then(() => bleActions.writeData({ id: bleInfo.id, data: formatSchedulesBuffer(schedules) }))
      .then(() => {
        progressMap[bleBlindUid] = 'complete';
      })
      .catch(() => {
        progressMap[bleBlindUid] = 'failed';
      })
      .then(() => {
        this.setState({ progressMap });
        count += 1;
        if (count === numBlinds) {
          this.onSyncComplete(progressMap);
        }
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ open: nextProps.open });
  }

  onSyncComplete = (progressMap) => {
    if (!_.find(progressMap, x => x === 'failed')) {
      // console.log('sync complete');
      locationActions.syncComplete();
    } else {
      console.log('sync failed');
    }
  }

  getSceneList = () => {
    const { bleBlinds, progressMap } = this.state;

    if (!Object.keys(bleBlinds).length) {
      return (
        <div>
          <p>{__('You have no blinds claimed.')}</p>
        </div>
      );
    }

    return _.map(bleBlinds, (blind, uid) => {
      let color = 'orange';
      let progress = __('pending');
      if (progressMap[uid] === 'complete') {
        color = 'green';
        progress = __('complete');
      } else if (progressMap[uid] === 'failed') {
        color = 'red';
        progress = __('failed');
      }
      return (
        <div key={uid}>
          <div className="sceneBlindList" >{`${blind.displayName}`}</div>
          <div className="sceneBlindList" style={{ color }}>{progress}</div>
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
    const { open } = this.props;
    const { progressMap, bleBlinds } = this.state;
    const inProgress = Object.keys(progressMap).length !== Object.keys(bleBlinds).length;

    const actions = [
      <FlatButton
        label="Close"
        primary
        onTouchTap={this.handleModalDismiss}
      />,
    ];

    const style = {
      refresh: {
        display: 'inline-block',
        position: 'relative',
      },
    };

    return (
      <Dialog
        actions={actions}
        open={open}
        title={__('Synchronizing Schedules')}
        titleClassName="hcenter"
        modal
        autoScrollBodyContent
      >
        <div className="centered">
          <br />
          <div>
            {this.getSceneList()}
          </div>
          <br />
          {
            inProgress &&
            <RefreshIndicator
              size={50}
              left={0}
              top={20}
              status="loading"
              style={style.refresh}
            />
          }
        </div>
      </Dialog>
    );
  }
}
