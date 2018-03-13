import React from 'react';

export default class SignalLevelIndicator extends React.PureComponent {

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    signalLevel: React.PropTypes.number,
    height: React.PropTypes.number,
  }

  static defaultProps = {
    signal: -100,
  }

  renderBars = () => {
    const { signalLevel } = this.props;
    // const bars = 5 - Math.floor(Math.abs(signal) / 20);
    const signalBars = [];
    const {
      text1Color, // green
      text2Color, // red
    } = this.context.muiTheme.palette;

    let backgroundColor = (signalLevel <= 2) ? text2Color : text1Color;

    for (let i = 1; i <= 5; i++) {
      backgroundColor = (i <= signalLevel) ? backgroundColor : 'transparent';
      signalBars.push(<div className="signalBar" key={i} style={{ height: `${i * 20}%`, backgroundColor }} />);
    }
    return signalBars;
  }

  render() {
    const { width, height, margin, display, alignItems } = this.context.muiTheme.signal;
    return (
      <div
        style={{
          width,
          height: this.props.height || height,
          margin,
          display,
          alignItems,
        }}
      >
        {this.renderBars()}
      </div>
    );
  }
}
