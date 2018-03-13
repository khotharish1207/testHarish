import React from 'react';


export default class DayInput extends React.Component {

  static propTypes = {
    readOnly: React.PropTypes.bool,
    days: React.PropTypes.string,
    onChange: React.PropTypes.func,
  }

  static defaultProps = {
    readOnly: false,
    days: '0111110',
    onChange: () => {},
  }

  constructor() {
    super();
    this.state = {
      weekDays: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    };
  }

  componentWillMount() {
    this.setState({ day: this.props.days });
  }

  /**
   * Toggled the day at index from schedule
   * @param index
   * @returns updated days string
   */
  toggleDay = (index) => {
    const { day } = this.state;
    let char = '1';
    if (day.charAt(index) === '1') {
      char = '0';
    }
    return [day.substr(0, index), char, day.substr(index + 1)].join('');
  };

  handleClick = days => (e) => {
    const { readOnly } = this.props;
    const { weekDays } = this.state;
    if (!readOnly) {
      e.preventDefault();
      const index = weekDays.indexOf(days);
      const day = this.toggleDay(index);
      this.setState({ day });
      this.props.onChange(day);
    }
  };

  daySelected = (day) => {
    const dayClass = 'day-input';
    const index = this.state.weekDays.indexOf(day);
    return this.state.day.charAt(index) === '1' ? `selected ${dayClass}` : dayClass;
  };

  render() {
    return (
      <div
        style={{ margin: '0 auto' }}
      >
        <div
          className={this.daySelected('SUN')}
          onTouchEnd={this.handleClick('SUN')}
        >S</div>
        <div
          className={this.daySelected('MON')}
          onTouchEnd={this.handleClick('MON')}
        >M</div>
        <div
          className={this.daySelected('TUE')}
          onTouchEnd={this.handleClick('TUE')}
        >T</div>
        <div
          className={this.daySelected('WED')}
          onTouchEnd={this.handleClick('WED')}
        >W</div>
        <div
          className={this.daySelected('THU')}
          onTouchEnd={this.handleClick('THU')}
        >T</div>
        <div
          className={this.daySelected('FRI')}
          onTouchEnd={this.handleClick('FRI')}
        >F</div>
        <div
          className={this.daySelected('SAT')}
          onTouchEnd={this.handleClick('SAT')}
        >S</div>
      </div>
    );
  }
}
