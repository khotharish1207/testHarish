import React from 'react';
import { TimePicker, Checkbox, SelectField, MenuItem, Slider } from 'material-ui';

import __ from '../utils/i18n';
import { MAX_SCHEDULES_PER_LOCATION } from '../constants';

import DayInput from './DayInput';

import locationStore from '../stores/locationStore';


const styles = {
  block: {
    maxWidth: 250,
  },
  checkbox: {
    marginBottom: 16,
    fontSize: 'larger',
  },
  customWidth: {
    width: 100,
    textAlign: 'center',
    fontSize: '20px',
  },
};

const selectItems = ['time', 'sunrise', 'sunset'];

export default class ScheduleForm extends React.Component {

  constructor() {
    super();
    this.state = {
      schedule: {
        time: 0,
        isScheduled: true,
        relativeTo: 'time',
        isRelative: false,
        offset: 0,
        days: '0111110',
      },
      selectValue: 1,
      sliderValue: 0,
      defaultTime: (new Date()),
    };
  }

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    onScheduleChange: React.PropTypes.func,
    schedule: React.PropTypes.object,
    scene: React.PropTypes.object,
    isScheduled: React.PropTypes.bool,
    relativeTo: React.PropTypes.string,
    isRelative: React.PropTypes.bool,
    offset: React.PropTypes.number,
    time: React.PropTypes.number,
    days: React.PropTypes.string,
  };

  static defaultProps = {
    time: new Date(),
    relativeTo: 'time',
    isRelative: false,
    isScheduled: false,
    offset: 0,
    days: '0111110',
  };

  componentWillMount() {
    const { isScheduled, relativeTo, isRelative, offset, time, days } = this.props;
    const selectValue = isRelative ? selectItems.indexOf(relativeTo) + 1 : 1;
    const sliderValue = offset;
    const defaultTime = this.timeConvert(time);
    const schedulesRemaining = MAX_SCHEDULES_PER_LOCATION - locationStore.getNumberOfScheduledScenes();

    this.setState({
      defaultTime,
      selectValue,
      sliderValue,
      schedulesRemaining,
      schedule: {
        time,
        isScheduled,
        relativeTo,
        isRelative,
        offset,
        days,
      },
    });
  }

  handleDaysChange = (days) => {
    const { schedule } = this.state;
    schedule.days = days;
    this.setState({ schedule });
    this.props.onScheduleChange(schedule);
  };

  handleSelectChange = (event, index, value) => {
    const { schedule } = this.state;
    const relative = selectItems[index];

    this.setState({ selectValue: value });
    if (relative === 'time') {
      schedule.isRelative = false;
      // Kept relativeTo value as sunrise if not relative
      schedule.relativeTo = 'sunrise';
    } else {
      schedule.isRelative = true;
      schedule.relativeTo = relative;
    }

    this.setState({ schedule });
    this.props.onScheduleChange(schedule);
  };

  handleSliderValue = (event, value) => {
    const { schedule } = this.state;
    this.setState({ sliderValue: value });
    schedule.offset = value;
    this.setState({ schedule });
    this.props.onScheduleChange(schedule);
  };

  onCheck = (event, isInputChecked) => {
    const { schedule, schedulesRemaining } = this.state;
    schedule.isScheduled = isInputChecked;
    this.setState({
      isScheduled: isInputChecked,
      schedule,
      schedulesRemaining: isInputChecked ? schedulesRemaining - 1 : schedulesRemaining + 1,
    });
    this.props.onScheduleChange(schedule);
  };

  // utils for time
  afterMidnight = date => Math.floor((date - new Date(date).setHours(0, 0, 0, 0)) / 60000);

  timeConvert = (min) => {
    const minutes = min % 60;
    const hours = (min - minutes) / 60;
    return new Date().setHours(hours, minutes);
  };

  onTimePickerChange = (event, date) => {
    const { schedule } = this.state;
    schedule.time = this.afterMidnight(date);
    this.setState({ schedule });
    this.props.onScheduleChange(schedule);
  };

  render() {
    const { primary3Color, accent2Color } = this.context.muiTheme.palette;
    const { schedule, selectValue, sliderValue, defaultTime, schedulesRemaining } = this.state;
    return (
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          height: 'calc(100vh - 144px)',
          overflow: 'auto',
        }}
      >
        <br />
        <br />

        <Checkbox
          label={__('Schedule this scene to run automatically')}
          style={styles.checkbox}
          onCheck={this.onCheck}
          defaultChecked={schedule.isScheduled}
          disabled={schedulesRemaining < 1}
        />
        <h4 style={{ color: primary3Color }}>
          {__('on')}
        </h4>
        <br />
        <div style={{ display: 'flex' }}>
          <DayInput
            onChange={this.handleDaysChange}
            days={schedule.days}
            readOnly={!schedule.isScheduled}
          />
        </div>
        <br />

        <h4 style={{ color: primary3Color }}>
          {__('at')}
        </h4>
        {/*
          <SelectField
            value={selectValue}
            onChange={this.handleSelectChange}
            style={styles.customWidth}
            disabled={!schedule.isScheduled}
          >
            <MenuItem value={1} primaryText="Time" />
            <MenuItem value={2} primaryText="Sunrise" />
            <MenuItem value={3} primaryText="Sunset" />
          </SelectField>
        */}
        <div>
          <br />
          <TimePicker
            className="scene-timepicker"
            hintText={__('Pick Time')}
            onChange={this.onTimePickerChange}
            okLabel={__('Set')}
            textFieldStyle={{ fontSize: 35 }}
            defaultTime={new Date(defaultTime)}
            disabled={!schedule.isScheduled}
          />
        </div>
        { // Temporary code commented.
          /*
          selectValue === 1
          ?
            <div>
              <br />
              <TimePicker
                className="scene-timepicker"
                hintText={__('Pick Time')}
                onChange={this.onTimePickerChange}
                okLabel={__('Set')}
                style={{ fontSize: 25 }}
                defaultTime={new Date(defaultTime)}
                disabled={!schedule.isScheduled}
              />
            </div>
          :
            <div
              className="align-center"
              style={{ display: 'block', margin: 'auto', width: '280px' }}
            >
              <div>
                <h3>{sliderValue}</h3>
                <h4>{__('minutes')}</h4>
              </div>

              <Slider
                style={{ padding: '0 2%' }}
                min={-60}
                max={60}
                step={1}
                defaultValue={0}
                value={sliderValue}
                onChange={this.handleSliderValue}
                disabled={!schedule.isScheduled}
              />
            </div>
          */
        }
        <br />
        <div style={{ color: accent2Color }}>
          <p style={{ margin: 0 }}>{schedulesRemaining} of {MAX_SCHEDULES_PER_LOCATION}</p>
          <p>{__('schedules remaining')}</p>
        </div>
      </div>
    );
  }
}
