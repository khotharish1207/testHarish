import React from 'react';
import { shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { FlatButton } from 'material-ui';

import baseTheme from '../../src/style/muiThemes/neo';
import UnclaimedBlindListItem from '../../src/components/UnclaimedBlindListItem';
import BlindIcon from '../../src/components/BlindIcon';
import SignalLevelIndicator from '../../src/components/SignalLevelIndicator';

describe('UnclaimedBlindListItem test cases', () => {
  let wrapper = null;
  const context = { muiTheme: getMuiTheme(baseTheme) };
  const blind = {
    id: '00:11:22:33:44:55',
    name: 'NEO0001',
    rssi: -1,
    connectionState: 'visible',
  };

  beforeEach(() => {
    wrapper = shallow(<UnclaimedBlindListItem
      bleId={blind.id}
      connectionState={blind.connectionState}
      rssi={blind.rssi}
      bleName={blind.name}
    />, { context });
  });

  afterEach(() => {
    wrapper = null;
  });

  it('DisplayName should be "unclaimed" ', () => {
    expect(wrapper.find('.list-group-control-title').node.props.children).to.have.string('unclaimed');
  });

  it('Connection info', () => {
    expect(wrapper.find('h5').node.props.children).to.have.string('NEO0001 | ');
  });

  it('It should have signal indicator', () => {
    expect(wrapper.find(SignalLevelIndicator)).to.exist;
    expect(wrapper.find(SignalLevelIndicator)).to.have.lengthOf(1);
  });

  it('BlindIcon should present and it should be disabled', () => {
    const blindIcon = wrapper.find(BlindIcon);
    expect(blindIcon).to.exist;
    expect(blindIcon).to.have.lengthOf(1);
    expect(blindIcon.node.props.disabled).to.be.true;
  });

  it('It should have button to claim the blind', () => {
    const flatButton = wrapper.find(FlatButton);
    expect(flatButton).to.exist;
    expect(flatButton).to.have.lengthOf(1);
    expect(flatButton.node.props.label).to.have.string('Claim this Blind');
  });
});
