import React from 'react';

import '../style/stylesheets/Remote.css';


export default class BlindRemote extends React.Component {

  static propTypes = {
    onClose: React.PropTypes.func,
    disableClose: React.PropTypes.bool,

    onStop: React.PropTypes.func,
    disableStop: React.PropTypes.bool,

    onOpen: React.PropTypes.func,
    disableOpen: React.PropTypes.bool,

    onFavourite: React.PropTypes.func,
    disableFavourite: React.PropTypes.bool,

    disabled: React.PropTypes.bool,
    helpMsg: React.PropTypes.bool,
  }

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  }

  static defaultProps = {
    onClose: () => {},
    disableClose: false,
    onStop: () => {},
    disableStop: false,
    onOpen: () => {},
    disableOpen: false,
    onFavourite: () => {},
    disableFavourite: false,
    disabled: false,
    showFavorite: true,
    helpMsg: false,
  }

  getblindUpIcon() {
    return { __html: require('!!raw!../style/img/icons/control/blindup.svg') };
  }

  getStopIcon() {
    return { __html: require('!!raw!../style/img/icons/control/blindstop.svg') };
  }

  getFavPositionIcon() {
    return { __html: require('!!raw!../style/img/icons/control/setfavposition.svg') };
  }

  getblindDownIcon() {
    return { __html: require('!!raw!../style/img/icons/control/blinddown.svg') };
  }

  handleOpen = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if ((!this.props.disabled && !this.props.disableOpen)
      || this.props.helpMsg) { this.props.onOpen(); }
  }

  handleStop = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if ((!this.props.disabled && !this.props.disableStop)
      || this.props.helpMsg) { this.props.onStop(); }
  }

  handleClose = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if ((!this.props.disabled && !this.props.disableClose)
      || this.props.helpMsg) { this.props.onClose(); }
  };

  handleFavourite = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if ((!this.props.disabled && !this.props.disableFavourite)
      || this.props.helpMsg) { this.props.onFavourite(); }
  };

  render() {
    const disableAll = this.props.disabled;
    const disableOpen = this.props.disableOpen;
    const disableStop = this.props.disableStop;
    const disableClose = this.props.disableClose;
    const disableFavourite = this.props.disableFavourite;
    const { remoteControlIcon } = this.context.muiTheme;
    const style = this.props.buttonSpacing;

    return (
      <div
        className="remote-control-group home-remote align-center"
      >
        <div
          className="remote-control-open"
          onClick={this.handleOpen}
          style={style}
        >
          <div
            className={['svg-icon control-icon', (disableAll || disableOpen ? ' disabled' : '')].join('')}
            dangerouslySetInnerHTML={this.getblindUpIcon()}
            style={remoteControlIcon}
          />
        </div>
        <div
          className="remote-control-stop"
          onClick={this.handleStop}
          style={style}
        >
          <div
            className={['svg-icon control-icon', (disableAll || disableStop ? ' disabled' : '')].join('')}
            dangerouslySetInnerHTML={this.getStopIcon()}
            style={remoteControlIcon}
          />
        </div>
        <div
          className="remote-control-fav"
          onClick={this.handleFavourite}
          style={style}
        >
          <div
            className={['svg-icon control-icon', (disableAll || disableFavourite ? ' disabled' : '')].join('')}
            dangerouslySetInnerHTML={this.getFavPositionIcon()}
            style={remoteControlIcon}
          />
        </div>

        <div
          className="remote-control-close"
          onClick={this.handleClose}
          style={style}
        >
          <div
            className={['svg-icon control-icon', (disableAll || disableClose ? ' disabled' : '')].join('')}
            dangerouslySetInnerHTML={this.getblindDownIcon()}
            style={remoteControlIcon}
          />
        </div>
      </div>
    );
  }
}
