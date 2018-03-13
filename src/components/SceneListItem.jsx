import React from 'react';
import { ListItem, Divider, FloatingActionButton } from 'material-ui';
import AvPlayCircleOutline from 'material-ui/svg-icons/av/play-circle-outline';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';

import __ from '../utils/i18n';
import { navTo } from '../utils/navUtils';

import SceneRunModal from './SceneRunModal';


export default class SceneListItem extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.state = {
      time: '6.00 am',
      open: false,
    };
  }

  static propTypes = {
    scene: React.PropTypes.object,
  };

  static defaultProps = {
    scene: {
      time: 0,
    },
    key: '123456',
  };

  componentWillMount() {
    const { scene, sceneId } = this.props;
    this.setState({
      time: this.timeToShow(scene),
      scene,
      sceneId,
    });
  }

  leftPad = (number) => ((number < 10 && number >= 0) ? '0' : '') + number;

  timeToShow = (scene) => {
    const minutes = scene.time % 60;
    const hours = (scene.time - minutes) / 60;
    const suffix = hours >= 12 ? 'PM' : 'AM';

    let str = '';
    if (scene.isRelative) {
      if (scene.offset === 0) {
        str = ` ${scene.relativeTo}`;
      } else if (scene.offset < 0) {
        str = ` ${Math.abs(scene.offset)} min before ${scene.relativeTo}`;
      } else {
        str = ` ${scene.offset} min after ${scene.relativeTo}`;
      }
    } else {
      str = `${(hours + 11) % 12 + 1}:${this.leftPad(minutes)} ${suffix}`;
    }
    return str;
  };

  onClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const { sceneId } = this.state;
    navTo('SceneView', sceneId);
  };

  runScene = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ open: true });
  };

  closeSceneRunModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { time, scene, open } = this.state;
    const listItemStyle = this.context.muiTheme.listItem;

    return (
      <div>
        <ListItem disabled style={listItemStyle} >
          <div
            className="row roomlistitem align-center"
            style={{ paddingTop: '0px', paddingBottom: '0px', margin: '-8px 0px' }}
          >
            <div className="col-xs-3 vcenter blindPadding">
              <FloatingActionButton
                iconStyle={{
                  width: 48,
                  height: 48,
                }}
                onTouchEnd={this.runScene}
              >
                <AvPlayCircleOutline />
              </FloatingActionButton>
            </div>
            <div className={'col-xs-7 vcenter'}>
              <h4 className="list-group-control-title">{ scene.displayName }</h4>
              <h5>{__('Adjust Blinds')}</h5>
              <p>
                {
                  scene.isScheduled
                  ?
                    __(`Runs at ${time} `)
                  :
                    __('Not Scheduled')
                }
              </p>
            </div>

            <div
              className={'col-xs-2 vcenter list-group-item-right-button'}
              onTouchEnd={this.onClick}
            >
              <ModeEdit color={'#00b7df'} />
            </div>

          </div>
        </ListItem>
        <Divider />

        {
          open
          &&
          <SceneRunModal
            open={open}
            sceneName={scene.displayName}
            runningLists={scene.bleBlinds}
            closeSceneModal={this.closeSceneRunModal}
          />
        }
      </div>
    );
  }
}
