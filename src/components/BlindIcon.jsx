import React from 'react';


export default class BlindIcon extends React.PureComponent {

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    percentClosed: React.PropTypes.number,
    targetPosition: React.PropTypes.number,
    targetTime: React.PropTypes.number,
    disabled: React.PropTypes.bool,
  }

  static defaultProps = {
    percentClosed: 50,
    targetPosition: 50,
    targetTime: 0,
    disabled: false,
  }

  render() {
    const { percentClosed, targetPosition, targetTime, disabled } = this.props;
    const animated = targetTime && (percentClosed !== targetPosition);
    const {
      height,
      width,
      blindColor,
      borderWidth,
      frameWidth,
      borderColor,
    } = this.context.muiTheme.blindIcon;
    const outerWidth = (2 * borderWidth) + width;

    return (
      <div>
        <div
          style={{
            position: 'relative',
            border: `${borderWidth}px solid ${borderColor}`,
            height,
            width: outerWidth,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              background: borderColor,
              height: height - (2 * borderWidth),
              width: frameWidth,
              position: 'absolute',
              top: 0,
              left: (width - frameWidth) / 2,
            }}
          />

          <div
            style={{
              background: borderColor,
              height: frameWidth,
              width,
              position: 'absolute',
              top: ((height - frameWidth) / 2) - borderWidth,
              left: 0,
            }}
          />

          <span
            style={{
              height,
              width,
              position: 'absolute',
              top: -borderWidth,
              left: 0,
              textAlign: 'center',
              fontFamily: 'arial',
              lineHeight: `${height}px`,
              fontSize: height / 1.4,
              color: blindColor,
              display: disabled ? 'inline' : 'none',
            }}
          >
          ?
          </span>

          <div
            style={{
              background: blindColor,
              height: animated ? `${targetPosition}%` : `${percentClosed}%`,
              transition: animated ? `height ${targetTime}s linear` : undefined,
              width,
              position: 'absolute',
              top: 0,
              left: 0,
              display: disabled ? 'none' : 'inline',
            }}
          />
        </div>
      </div>
    );
  }
}
