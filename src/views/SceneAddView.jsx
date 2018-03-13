import React from 'react';
import { RaisedButton, FlatButton, Dialog, TextField } from 'material-ui';
import _ from 'lodash';

import __ from '../utils/i18n';
import { goBack } from '../utils/navUtils';

import NavWrapper from '../components/NavWrapper';
import SceneForm from '../components/SceneForm';
import SceneRunModal from '../components/SceneRunModal';

import locationStore from '../stores/locationStore';
import locationActions from '../actions/locationActions';


const buttonStyle = {
  width: '40%',
  margin: '10px 2.5%',
};

export default class SceneAddView extends React.Component {

  constructor() {
    super();
    this.state = {
      displayName: null,
      bleBlinds: {},
      time: 0,
      isScheduled: false,
      isRelative: false,
      relativeTo: 'sunrise',
      offset: 0,
      days: '0111110',

      open: true,
      name: null,
      runScene: false,
    };
  }

  componentWillMount() {
    this.onLocationStoreChange();
    locationStore.listen(this.onLocationStoreChange);
  }

  componentWillUnmount() {
    locationStore.unlisten(this.onLocationStoreChange);
  }

  /**
   * Listen to locationStore to get the claimed blinds and
   * creates the scene object with default blind position(50).
   */
  onLocationStoreChange = () => {
    const bleBlinds = locationStore.getBleBlinds();
    const scenes = {};
    _.map(bleBlinds, (item, key) => {
      scenes[key] = 50;
    });
    this.setState({ bleBlinds: scenes });
  };

  /**
   * Creates new scene to set location.
   * Navigate back to scene list view
   * @constructor
   */
  CreateScene = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { displayName, bleBlinds, time, isScheduled,
      relativeTo, isRelative, offset, days } = this.state;
    const newScene = {
      displayName,
      time,
      isScheduled,
      relativeTo,
      isRelative,
      offset,
      days,
      bleBlinds,
    };
    locationActions.create({
      resourceType: 'scene',
      obj: newScene,
    });
    goBack();
  };

  closeSceneRunModal = () => {
    this.setState({ runScene: false });
  };

  openSceneRunModal = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ runScene: true });
  };

  /**
   * Listen to change in position of blind in any blind of scene.
   * @param newState - scene object with all blinds and their updated position.
   */
  handleBleChange = (newState) => {
    this.setState({ bleBlinds: newState });
  };

  /**
   * Listen to change in schedule of scene.
   * @param newSchedule - schedule object with updated schedule values.
   */
  handleScheduleChange = (newSchedule) => {
    const { time, isScheduled, relativeTo, isRelative, offset, days } = newSchedule;
    this.setState({ time, isScheduled, relativeTo, isRelative, offset, days });
  };

  nameScene = () => {
    const { name } = this.state;
    name.length && this.setState({ displayName: name });
    this.handleCloseModal();
  };

  openRenameModal = () => {
    this.setState({ open: true });
  };

  handleCloseModal = () => {
    this.setState({ open: false });
  };

  /**
   * Renders scene name/rename modal
   * @returns {XML}
   */
  renderModal() {
    const { open, name, displayName } = this.state;
    const actions = [
      <FlatButton
        label={__('Okay')}
        primary
        disabled={!name}
        onTouchEnd={this.nameScene}
      />,
      <FlatButton
        label={__('Cancel')}
        primary
        onTouchEnd={displayName ? this.handleCloseModal : goBack}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        open={open}
        repositionOnUpdate={_PLATFORM === 'android'}
        autoDetectWindowHeight={_PLATFORM === 'android'}
      >
        <TextField
          type="text"
          style={{ width: '100%' }}
          onChange={e => this.setState({ name: e.target.value })}
          floatingLabelText={__('Name this scene')}
          floatingLabelStyle={{ textAlign: 'center' }}
        />
      </Dialog>
    );
  }

  render() {
    const { bleBlinds, schedule, displayName, isScheduled,
      time, relativeTo, isRelative, offset, days, runScene } = this.state;

    return (
      <NavWrapper
        title={displayName}
        leftIcon="back"
        leftAction={goBack}
        handleTouch={this.openRenameModal}
      >
        <SceneForm
          bleBlinds={bleBlinds}
          onBleChange={this.handleBleChange}

          onScheduleChange={this.handleScheduleChange}
          schedule={schedule}
          time={time}
          relativeTo={relativeTo}
          isScheduled={isScheduled}
          isRelative={isRelative}
          offset={offset}
          days={days}
        />

        <div className="align-center sceneViewBottomButtonsDiv">
          <RaisedButton
            className="run-scene"
            label={__('Run Now')}
            style={buttonStyle}
            onClick={this.openSceneRunModal}
          />
          <RaisedButton
            className="create"
            label={__('Create')}
            style={buttonStyle}
            onClick={this.CreateScene}
            primary
          />
        </div>

        {
          runScene
          &&
          <SceneRunModal
            open={runScene}
            sceneName={displayName}
            runningLists={bleBlinds}
            closeSceneModal={this.closeSceneRunModal}
          />
        }

        {this.renderModal()}
      </NavWrapper>
    );
  }
}
