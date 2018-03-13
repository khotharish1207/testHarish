import React from 'react';
import { ListItem, Divider } from 'material-ui';
import _ from 'lodash';

import __ from '../utils/i18n';

import SceneViewListItem from './SceneViewListItem';

import locationStore from '../stores/locationStore';


export default class SceneViewList extends React.Component {

  constructor() {
    super();
    this.state = {
      scene: {},
      bleBlinds: {},
    };
    this.onLocationStoreChange = this.onLocationStoreChange.bind(this);
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { blinds } = this.props;
    blinds && this.setState({ scene: blinds });
    this.onLocationStoreChange();
    locationStore.listen(this.onLocationStoreChange);
  }

  componentWillUnmount() {
    locationStore.unlisten(this.onLocationStoreChange);
  }

  /**
   * Listen to locationStore to get all claimed blinds.
   * Create an object with blind's position and whether the blind is included.
   */
  onLocationStoreChange() {
    const blinds = this.props.blinds ? this.props.blinds : {};
    const bleBlinds = locationStore.getBleBlinds();
    const scenes = {};

    _.map(bleBlinds, (item, key) => {
      if (_.isNumber(blinds[key])) {
        scenes[key] = {
          included: true,
          position: blinds[key],
        };
      } else {
        scenes[key] = {
          included: false,
          position: 50,
        };
      }
    });
    this.setState({ bleBlinds: scenes });
  }

  handleChangeBlind = (blindState) => {
    const { scene } = this.state;
    const { blind, uid } = blindState;

    if (blind.included) {
      scene[uid] = blind.position;
    } else {
      delete scene[uid];
    }

    this.setState({ scene });
    this.props.onBleChange(scene);
  };

  renderSceneViewListItem() {
    const { bleBlinds } = this.state;
    if (bleBlinds && Object.keys(bleBlinds).length < 1) {
      return (
        <div>
          <ListItem className="none-in-list">
            <p>{__('You have not claimed any blind.')}</p>
          </ListItem>
          <Divider
            inset={false}
          />
        </div>
      );
    }

    return (
      _.map(bleBlinds, (value, key) =>
        <SceneViewListItem
          onChange={this.handleChangeBlind}
          scene={value}
          uid={key}
          key={key}
        />
      )
    );
  }

  render() {
    const { style } = this.props;
    return (
      <div style={style}>
        {this.renderSceneViewListItem()}
      </div>
    );
  }
}
