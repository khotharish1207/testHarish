import React from 'react';
import { Tabs, Tab } from 'material-ui';

import __ from '../utils/i18n';

import SceneViewList from './SceneViewList';
import ScheduleForm from './ScheduleForm';


export default class SceneForm extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    bleBlinds: React.PropTypes.object,
    onBleChange: React.PropTypes.func,

    onScheduleChange: React.PropTypes.func,
    time: React.PropTypes.number,
    isScheduled: React.PropTypes.bool,
    relativeTo: React.PropTypes.string,
    isRelative: React.PropTypes.bool,
    offset: React.PropTypes.number,
    days: React.PropTypes.string,
  };

  static defaultProps = {
    bleBlinds: {},
    time: 0,
    isScheduled: true,
    relativeTo: 'time',
    isRelative: false,
    offset: 0,
    days: '0111110',
    onBleChange: () => {},
    onScheduleChange: () => {},
  };

  render() {
    const { bleBlinds, isScheduled, time, relativeTo, isRelative, offset, days } = this.props;
    const { tab, sceneViewList } = this.context.muiTheme;

    return (
      <div >
        <Tabs>
          <Tab
            label={__('Blinds')}
            style={tab}
          >
            <SceneViewList
              blinds={bleBlinds}
              onBleChange={this.props.onBleChange}
              style={sceneViewList}
            />
          </Tab>
          <Tab
            label={__('Schedule')}
            style={tab}
          >
            <ScheduleForm
              onScheduleChange={this.props.onScheduleChange}
              time={time}
              isScheduled={isScheduled}
              relativeTo={relativeTo}
              isRelative={isRelative}
              offset={offset}
              days={days}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}
