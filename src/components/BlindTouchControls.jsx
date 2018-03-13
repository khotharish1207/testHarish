import React from 'react';
import Swipeable from 'react-swipeable';

import __ from '../utils/i18n.js';


export default class BlindTouchControls extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  static propTypes = {
    percentClosed: React.PropTypes.number,
    onOpen: React.PropTypes.func,
    onClose: React.PropTypes.func,
    onStop: React.PropTypes.func,
    onGoToPosition: React.PropTypes.func,
    disabled: React.PropTypes.bool,
    targetPosition: React.PropTypes.number,
    targetTime: React.PropTypes.number,
  }

  static defaultProps = {
    percentClosed: 50,
    onOpen: () => { console.log('OPEN!'); },
    onClose: () => { console.log('CLOSE!'); },
    onStop: () => { console.log('STOP!'); },
    onGoToPosition: (percentClosed) => { console.log(`GO TO: ${percentClosed}!`); },
    disabled: false,
  }

  componentWillMount() {
    this.setState({
      swipeTargetPosition: this.props.percentClosed,
      initialPosition: this.props.percentClosed,
      opacity: 0,
      msg: __('Swipe Control'),
    });
  }

  handleSwiping = (event, deltaX, deltaY) => {
    const { height } = this.context.muiTheme.blindTouchControls;
    const { percentClosed } = this.props;
    const { isSwiping, timeout } = this.state;
    let { initialPosition } = this.state;
    if (!isSwiping) {
      // console.log('Started swiping.');
      initialPosition = percentClosed;
      clearTimeout(timeout);
      this.setState({
        showMsg: false,
        isSwiping: true,
        initialPosition,
        opacity: 0.5,
        fadeOut: false,
      });
    }
    const deltaPercent = 100 * (deltaY / height);
    const newTarget = initialPosition - deltaPercent;
    this.setState({ swipeTargetPosition: newTarget });
    // console.log(`target: ${newTarget}, initial:${initialPosition}, delta:${deltaPercent}`);
  }

  boundPosition = (position) => {
    if (position > 100) {
      return 100;
    }
    if (position < 0) {
      return 0;
    }
    return position;
  }

  handleSwiped = (event, deltaX, deltaY, isFlick) => {
    const { swipeTargetPosition } = this.state;
    let newTarget = Math.round(this.boundPosition(swipeTargetPosition));
    let msg;
    if (isFlick) {
      if (deltaY < 0) {
        newTarget = 100;
      } else {
        newTarget = 0;
      }
    }
    if (newTarget === 100) {
      msg = __('Close!');
      this.props.onClose();
    } else if (newTarget === 0) {
      msg = __('Open!');
      this.props.onOpen();
    } else {
      msg = `${__('Go to')} ${newTarget}% ${__('closed')}!`;
      this.props.onGoToPosition(newTarget);
    }
    this.setState({
      isSwiping: false,
      swipeTargetPosition: newTarget,
      msg,
      showMsg: true,
      timeout: setTimeout(() => {
        this.setState({ opacity: 0, showMsg: false, fadeOut: true, msg: __('Swipe Control') });
      }, 1500),
    });
  }

  handleTap = () => {
    clearTimeout(this.state.timeout);
    this.props.onStop();
    this.setState({
      msg: 'Stop!',
      swipeTargetPosition: 100, // this.props.percentClosed,
      opacity: 0.5,
      fadeOut: false,
      showMsg: true,
      timeout: setTimeout(() => {
        this.setState({ opacity: 0, showMsg: false, fadeOut: true, msg: __('Swipe Control') });
      }, 1500),
    });
  }

  render() {
    const { percentClosed, disabled, targetTime, targetPosition } = this.props;
    const { swipeTargetPosition, msg, showMsg, opacity, fadeOut, isSwiping } = this.state;

    const animated = targetTime && (percentClosed !== targetPosition);
    const displayedSwipedTargetPosition = this.boundPosition(swipeTargetPosition);
    const {
      height,
      width,
      blindColor,
      overlayColor,
      commandMsgColor,
      percentMsgColor,
      borderWidth,
      borderColor,
      frameWidth,
      fontSize,
    } = this.context.muiTheme.blindTouchControls;
    const outerWidth = (2 * borderWidth) + width;

    return (
      <div>
        <p
          style={{
            textAlign: 'center',
            color: isSwiping ? percentMsgColor : commandMsgColor,
            fontSize,
            margin: '5px',
            opacity: disabled ? 0 : 1,
            transition: fadeOut && 'opacity 2s',
          }}
        >
          { isSwiping ? `${Math.round(displayedSwipedTargetPosition)}%` : msg }
        </p>
        <Swipeable
          stopPropagation
          delta={5}
          style={{
            position: 'relative',
            border: `${borderWidth}px solid ${borderColor}`,
            height,
            width: outerWidth,
            margin: '0 auto',
          }}
          onSwiping={disabled ? null : this.handleSwiping}
          onSwiped={disabled ? null : this.handleSwiped}
          flickThreshold={0.3}
          onTouchTap={disabled ? null : this.handleTap}
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
              background: overlayColor,
              opacity: showMsg ? opacity + 0.25 : opacity,
              height: `${displayedSwipedTargetPosition}%`,
              width,
              position: 'absolute',
              top: 0,
              left: 0,
              transition: fadeOut && 'opacity 2s',
            }}
          />
        </Swipeable>
        <p
          style={{
            textAlign: 'center',
            fontSize,
            margin: '5px',
            color: blindColor,
            opacity: disabled ? 0 : 1,
          }}
        >{__(`${percentClosed}%`)}</p>
      </div>
    );
  }
}
