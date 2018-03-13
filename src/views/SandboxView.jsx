import React from 'react';
import { Slider, Checkbox } from 'material-ui';

import NavWrapper from '../components/NavWrapper';
import BlindTouchControls from '../components/BlindTouchControls';
import BlindIcon from '../components/BlindIcon';


export default class SandboxView extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.setState({
      percentClosed: 50,
      checked: false,
    });
  }

  render() {
    const { percentClosed, checked } = this.state;

    return (
      <NavWrapper title="Sandbox">
        <div className="flex-container" style={{ minHeight: 400 }}>
          <div className="flex-item">
            <BlindTouchControls percentClosed={percentClosed} disabled={checked} />
          </div>
          <div className="flex-item">
            <BlindIcon percentClosed={percentClosed} disabled={checked} />
          </div>
        </div>
        <Slider
          min={0}
          max={100}
          step={1}
          value={percentClosed}
          onChange={(event, value) => { this.setState({ percentClosed: value }); }}
        />
        <Checkbox
          checked={checked}
          label={'Disable'}
          onCheck={(event, isChecked) => { this.setState({ checked: isChecked }); }}
        />
      </NavWrapper>
    );
  }
}
