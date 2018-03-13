/* globals _PLATFORM */

import React from 'react';
import { RaisedButton, FlatButton, Dialog, TextField } from 'material-ui';

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

export default class SceneView extends React.Component {

  // Note this.props.params.id refers to scene uid.
  constructor() {
    super();
    this.state = {
      displayName: __('Good Morning'),
      bleBlinds: {},
      schedule: {},
      time: 0,
      isScheduled: true,
      relativeTo: 'time',
      isRelative: false,
      offset: 0,
      days: '0111110',

      runScene: false,
      rename: false,
      open: false,
      disableSave: true,
    };
  }

  static propTypes = {
    params: React.PropTypes.object.isRequired,
  }

  static defaultProps = {
    params: { id: '123' },
  };

  componentWillMount() {
    this.onLocationStoreChange();
  }

  componentDidMount() {
    locationStore.listen(this.onLocationStoreChange);
  }

  componentWillUnmount() {
    locationStore.unlisten(this.onLocationStoreChange);
  }

  onLocationStoreChange = () => {
    const sceneId = this.props.params.id;
    const scene = locationStore.getScene(sceneId);
    this.setState({
      scene,
      bleBlinds: scene.bleBlinds,
      displayName: scene.displayName,
      time: scene.time,
      isScheduled: scene.isScheduled,
      relativeTo: scene.relativeTo,
      isRelative: scene.isRelative,
      offset: scene.offset,
      days: scene.days,
    });
  }

  closeSceneRunModal = () => {
    this.setState({ runScene: false });
  };

  openSceneRunModal = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ runScene: true });
  };

  /**
   * Update the scene
   */

  saveScene = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const { scene, displayName, bleBlinds, isScheduled,
      time, relativeTo, isRelative, offset, days } = this.state;
    const sceneId = this.props.params.id;

    scene.displayName = displayName;
    scene.bleBlinds = bleBlinds || {};
    scene.time = time;
    scene.isScheduled = isScheduled;
    scene.relativeTo = relativeTo;
    scene.isRelative = isRelative;
    scene.offset = offset;
    scene.days = days;

    locationActions.update({
      resourceType: 'scene',
      obj: scene,
      resourceId: sceneId,
    });

    // Show save modal
    this.setState({
      disableSave: true,
    });

    goBack();
  };

  /**
   * Delete the scene
   */
  deleteScene = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const sceneId = this.props.params.id;

    locationActions.remove({
      resourceType: 'scene',
      resourceId: sceneId,
    });
    goBack();
  };

  /**
   * Listen to change in blinds position.
   * @param newState - Object - Blinds with updated positions
   */
  handleBleChange = (newState) => {
    this.setState({
      bleBlinds: newState,
      disableSave: false,
    });
  };

  /**
   * Listen to change in scene schedule.
   * @param newState - Object - scene with updated schedule.
   */
  handleScheduleChange = (newSchedule) => {
    this.setState({
      time: newSchedule.time,
      isScheduled: newSchedule.isScheduled,
      relativeTo: newSchedule.relativeTo,
      isRelative: newSchedule.isRelative,
      offset: newSchedule.offset,
      days: newSchedule.days,
      disableSave: false,
    });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  openRenameModal = () => {
    this.setState({
      open: true,
      rename: true,
      newName: this.state.displayName,
    });
  };

  openDeleteModal = () => {
    this.setState({
      open: true,
      rename: false,
    });
  }

  /**
   * Renders Scene rename dialog
   */
  renderModal() {
    const { open, rename, displayName } = this.state;
    const actions = rename ? [
      <FlatButton
        label={__('Okay')}
        primary
        disabled={!displayName}
        onTouchEnd={this.closeModal}
      />,
    ] : [
      <FlatButton
        label={__('Confirm')}
        primary
        onTouchEnd={this.deleteScene}
      />,
      <FlatButton
        label={__('Cancel')}
        primary
        onTouchEnd={this.closeModal}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        open={open}
        repositionOnUpdate={_PLATFORM === 'android'}
        autoDetectWindowHeight={_PLATFORM === 'android'}
      >
        {
          rename
          ?
            <TextField
              type="text"
              style={{ width: '100%' }}
              value={displayName}
              onChange={e => this.setState({ displayName: e.target.value, disableSave: false })}
              floatingLabelText={__('Scene Name')}
              floatingLabelStyle={{ textAlign: 'center' }}
            />
          :
            __('Are you sure you want to delete this scene.')
        }
      </Dialog>
    );
  }

  render() {
    const { runScene, displayName, bleBlinds, isScheduled, disableSave,
      time, relativeTo, isRelative, offset, days } = this.state;
    return (
      <NavWrapper
        title={displayName}
        leftIcon="back"
        leftAction={goBack}
        rightIcon="delete"
        rightAction={this.openDeleteModal}
        handleTouch={this.openRenameModal}
      >
        <SceneForm
          bleBlinds={bleBlinds}
          onBleChange={this.handleBleChange}

          onScheduleChange={this.handleScheduleChange}
          time={time}
          isScheduled={isScheduled}
          relativeTo={relativeTo}
          isRelative={isRelative}
          offset={offset}
          days={days}
        />

        <div className="align-center sceneViewBottomButtonsDiv">
          <RaisedButton
            className="run-scene"
            label={__('Run Scene')}
            style={buttonStyle}
            onClick={this.openSceneRunModal}
          />
          <RaisedButton
            className="create"
            label={__('Save')}
            style={buttonStyle}
            onClick={this.saveScene}
            disabled={disableSave}
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
