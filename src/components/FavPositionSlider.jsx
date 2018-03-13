import React from 'react';
import { Slider } from 'material-ui';

import __ from '../utils/i18n';


export default class FavPositionSlider extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    defaultValue: React.PropTypes.number,
    onChange: React.PropTypes.func,
    onDragStop: React.PropTypes.func,
  }

  static defaultProps = {
    defaultValue: 50,
    onChange: () => {},
    onDragStop: () => {},
  }

  componentWillMount() {
    const { defaultValue } = this.props;
    this.setState({ value: defaultValue });
  }

  componentWillReceiveProps() {
    const { defaultValue } = this.props;
    this.setState({ value: defaultValue });
  }

  onChange = (event, value) => {
    event.stopPropagation();
    event.preventDefault();
    this.props.onChange(value);
  };

  onDragStop = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.props.onDragStop();
  };

  render() {
    const { value } = this.state;
    const { favPositionSlider } = this.context.muiTheme;

    return (
      <div
        className="FavPositionSliderWrapper"
      >
        <p style={favPositionSlider.textStyle}>
          {__('Favourite Position')}
        </p>
        <Slider
          className="FavPositionSlider"
          axis="y-reverse"
          value={value}
          step={1}
          min={0}
          max={100}
          style={favPositionSlider.sliderStyle}
          onChange={this.onChange}
          onDragStop={this.onDragStop}
        />
        <p style={favPositionSlider.textStyle}>{__(`${value}%`)}</p>
      </div>
    );
  }
}
