import React from 'react';
import { ListItem, Divider, Slider, Checkbox } from 'material-ui';
import ActionHighlightOff from 'material-ui/svg-icons/action/highlight-off';
import ToggleRadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';

import __ from '../utils/i18n';

import BlindIcon from './BlindIcon';

import locationStore from '../stores/locationStore';


export default class SceneViewListItem extends React.Component {

  static propTypes = {
    scene: React.PropTypes.object,
    onChange: React.PropTypes.func,
    uid: React.PropTypes.string,
  };

  static defaultProps = {
    scene: {
      included: false,
      position: 50,
    },
    uid: '12345',
    onChange: () => {},
  };

  constructor() {
    super();
    this.state = {
      blind: {
        included: false,
        position: 50,
      },
    };
  }

  componentWillMount() {
    const { scene, uid } = this.props;
    const ble = locationStore.getBleBlinds()[uid];
    const displayName = ble ? ble.displayName : __('unnamed');
    this.setState({ blind: scene, uid, displayName });
  }

  onCheck = (event, isInputChecked) => {
    const { blind } = this.state;
    blind.included = isInputChecked;
    this.setState({ blind });
    this.props.onChange(this.state);
  };

  handleSecondSlider = (event, value) => {
    const { blind } = this.state;
    blind.position = value;
    this.setState({ blind });
    this.props.onChange(this.state);
  };

  render() {
    const { blind, displayName } = this.state;
    return (
      <div>
        <ListItem
          disabled
        >
          <div className="row roomlistitem align-center" >
            <div className="col-xs-3 vcenter blindPadding">
              <div className="hcenter">
                <BlindIcon
                  style={{ margin: '0 auto' }}
                  percentClosed={blind.position}
                  disabled={!blind.included}
                />
              </div>
            </div>
            <div className={'col-xs-7 vcenter'}>
              <h4 className="list-group-control-title">{displayName}</h4>
              {
                blind.included
                ?
                  <div style={{ paddingTop: 5 }}>
                    <span>{__('Go to') + ` ${blind.position}%`}</span>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      defaultValue={blind.position}
                      value={blind.position}
                      sliderStyle={{ margin: '5px auto' }}
                      onChange={this.handleSecondSlider}
                    />
                  </div>
                :
                  <div
                    style={{ margin: '16.5px auto' }}
                  >
                    {__('Not Included')}
                  </div>
              }
            </div>
            <div className={'col-xs-1 vcenter'}>
              <Checkbox
                defaultChecked={blind.included}
                checkedIcon={<ActionHighlightOff />}
                uncheckedIcon={<ToggleRadioButtonUnchecked />}
                onCheck={this.onCheck}
              />
            </div>
          </div>
        </ListItem>
        <Divider />
      </div>
    );
  }
}
