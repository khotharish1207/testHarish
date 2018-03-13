import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import timeZones from '../utils/timeZones';
import __ from '../utils/i18n';


export default class TimeZoneInput extends React.Component {

  static propTypes = {
    defaultTimeZone: React.PropTypes.string,
    onChange: React.PropTypes.func,
  }

  static defaultProps = {
    label: __('Time Zone'),
    onChange: () => {},
  }

  componentWillMount() {
    this.setState({
      value: this.props.defaultTimeZone,
    });
  }

  handleChange = (val) => {
    this.setState({
      value: val,
    });
    this.props.onChange(val);
  }

  render() {
    return (
      <Select
        name="Timezone"
        placeholder="Time Zone"
        value={this.state.value || this.props.defaultTimeZone}
        options={timeZones}
        onChange={this.handleChange}
        autoBlur
        onBlurResetsInput={false}
        resetValue={this.props.defaultTimeZone}
      />
    );
  }
}

