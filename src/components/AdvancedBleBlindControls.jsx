import React from 'react';
import ReactDOM from 'react-dom';
import { Divider, Card, CardHeader, CardActions, RaisedButton } from 'material-ui';

import __ from '../utils/i18n';
import { generateCommandHandler } from '../utils/bleUtils';

import bleActions from '../actions/bleActions';


const style = {
  margin: 10,
  width: 100,
};

export default class AdvancedBleBlindControls extends React.Component {

  static propTypes = {
    bleId: React.PropTypes.string, // BLE id
    disabled: React.PropTypes.bool,
  };

  componentWillMount() {
    this.setState({
      expanded: false,
    });
  }

  handleExpandChange = (expanded) => {
    this.setState({ expanded });
    if (expanded) {
      console.log('expanded');
      setTimeout(() => {
        const container = ReactDOM.findDOMNode(this);
        container.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 10);
    }
  };

  render() {
    const { bleId, disabled } = this.props;
    return (
      <Card
        zDepth={0}
        expanded={this.state.expanded}
        onExpandChange={this.handleExpandChange}
        style={{ marginLeft: '10%', marginRight: '10%', textAlign: 'center' }}
      >
        <Divider />
        <CardHeader
          title={__('Advanced Settings')}
          style={{ paddingBottom: 0 }}
          actAsExpander
          showExpandableButton
        />
        <CardActions expandable >
          <p style={{ margin: 0 }}>Limit Adjustments</p>
          <RaisedButton
            disabled={disabled}
            style={style}
            label={__('Step Up')}
            onTouchTap={generateCommandHandler(bleId, 'cu', bleActions.writeData)}
          />
          <RaisedButton
            disabled={disabled}
            style={style}
            label={__('Step Dn')}
            onTouchTap={generateCommandHandler(bleId, 'cd', bleActions.writeData)}
          />
          <br />
          <RaisedButton
            disabled={disabled}
            style={style}
            label={__('Micro Up')}
            onTouchTap={generateCommandHandler(bleId, 'fu', bleActions.writeData)}
          />
          <RaisedButton
            disabled={disabled}
            style={style}
            label={__('Micro Dn')}
            onTouchTap={generateCommandHandler(bleId, 'fd', bleActions.writeData)}
          />
          <br />
          <RaisedButton
            disabled={disabled}
            style={style}
            label={__('Set Lim Up')}
            onTouchTap={generateCommandHandler(bleId, 'lu', bleActions.writeData)}
          />
          <RaisedButton
            disabled={disabled}
            style={style}
            label={__('Set Lim Dn')}
            onTouchTap={generateCommandHandler(bleId, 'ld', bleActions.writeData)}
          />
          <p style={{ margin: 0 }}>Other</p>
          <RaisedButton
            disabled={disabled}
            style={{ margin: 10, width: 220 }}
            label={__('Reverse Rotation')}
            onTouchTap={generateCommandHandler(bleId, 'rv', bleActions.writeData)}
          />
        </CardActions>
      </Card>
    );
  }
}
