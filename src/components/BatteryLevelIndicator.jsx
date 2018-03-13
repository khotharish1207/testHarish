import React from 'react';

export default class BatteryLevelIndicator extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    battery: React.PropTypes.number,
    disabled: React.PropTypes.bool,
  }

  static defaultProps = {
    battery: 0,
    disabled: false,
  }

  render() {
    const { battery, disabled } = this.props;
    const batteryStyle = this.context.muiTheme.battery;
    const {
      text1Color, // green
      text2Color, // red
      accent2Color, // lightGray
    } = this.context.muiTheme.palette;
    const backgroundColor = disabled ? 'transparent' : (battery < 20) ? text2Color : text1Color;

    const batteryLife = {
      backgroundColor,
      width: `${battery}%`,
      height: 17,
    };

    return (
      <div
        style={
          batteryStyle
        }
      >
        <div style={batteryLife} />
        <div
          style={{
            height: 7,
            width: 2,
            backgroundColor: accent2Color,
            position: 'relative',
            marginTop: -12,
            marginLeft: 29,
          }}
        />
      </div>
    );
  }
}
