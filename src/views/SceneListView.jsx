import React from 'react';
import _ from 'lodash';
import { FloatingActionButton, ListItem, Divider } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Refresh from 'material-ui/svg-icons/navigation/refresh';

import __ from '../utils/i18n';
import { navTo } from '../utils/navUtils';

import SceneSyncModal from '../components/SceneSyncModal';
import NavWrapper from '../components/NavWrapper';
import SceneListItem from '../components/SceneListItem';
import LoadingIndicator from '../components/LoadingIndicator';

import locationStore from '../stores/locationStore';


export default class SceneListView extends React.Component {

  constructor() {
    super();
    this.state = {
      open: false,
    };
  }

  componentWillMount() {
    this.onLocationStoreChange(locationStore.getState());
  }

  componentDidMount() {
    locationStore.listen(this.onLocationStoreChange);
  }

  componentWillUnmount() {
    locationStore.unlisten(this.onLocationStoreChange);
  }

  onLocationStoreChange = (newState) => {
    const { isFetchingLocation, unsyncedChanges } = newState;
    const scenes = locationStore.getBleScenes();
    this.setState({ scenes, unsyncedChanges, isFetchingLocation });
  };

  addScene = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navTo('SceneAddView');
  };

  renderScene = () => {
    const { scenes } = this.state;
    if (scenes && Object.keys(scenes).length < 1) {
      return (
        <div>
          <ListItem className="none-in-list">
            <p>{__('You have not created any scene yet.')}</p>
          </ListItem>
          <Divider
            inset={false}
          />
        </div>
      );
    }
    return (
      _.map(scenes, (scene, uid) =>
        <SceneListItem
          scene={scene}
          sceneId={scene.uid}
          key={uid}
        />
      )
    );
  };

  showSceneSyncModal = () => {
    this.setState({ open: true });
  };

  closeSceneSyncModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { open, unsyncedChanges, isFetchingLocation } = this.state;
    const style = {
      margin: '5px 20px',
    };

    const divStyle = {
      width: 100,
      float: 'left',
    };

    return (
      <NavWrapper
        title="Scenes"
        rightIcon="help"
      >
        <div
          style={{
            height: 'calc(100vh - 136px)',
            overflow: 'auto',
          }}
        >
          {this.renderScene()}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
          className="hcenter sceneViewBottomButtonsDiv"
        >
          <div style={divStyle}>
            <FloatingActionButton
              onTouchEnd={this.addScene}
              style={style}
            >
              <ContentAdd />
            </FloatingActionButton>
            <span>{__('Create Scene')}</span>
          </div>

          <div style={divStyle}>
            <FloatingActionButton
              style={style}
              className={unsyncedChanges ? 'bounce' : null}
              backgroundColor={unsyncedChanges ? 'red' : null}
              onTouchEnd={this.showSceneSyncModal}
            >
              <Refresh />
            </FloatingActionButton>
            <span>{unsyncedChanges ? __('Sync Required') : __('Sync Blinds')}</span>
          </div>
        </div>

        {
          open &&
          <SceneSyncModal
            open={open}
            closeSceneModal={this.closeSceneSyncModal}
          />
        }

        {isFetchingLocation && <LoadingIndicator />}

      </NavWrapper>
    );
  }
}
