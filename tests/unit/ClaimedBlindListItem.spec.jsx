import React from 'react';
import { shallow } from 'enzyme';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import HardwareKeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

import baseTheme from '../../src/style/muiThemes/neo';
import ClaimedBlindListItem from '../../src/components/ClaimedBlindListItem';
import BlindRemote from '../../src/components/BlindRemote';
import BlindIcon from '../../src/components/BlindIcon';
import SignalLevelIndicator from '../../src/components/SignalLevelIndicator';

describe('ClaimedBlindListItem test cases', () => {
  let wrapper = null;
  const context = { muiTheme: getMuiTheme(baseTheme), router: {} };

  beforeEach(() => {
    wrapper = shallow(<ClaimedBlindListItem
      displayName={'NEO0001'}
      uid={'-KZVpaT9dbdXGzqIZ23Y'}
      bleName={'NEO0001'}
      favPosition={33}
    />, { context });
  });

  afterEach(() => {
    wrapper = null;
  });

  it('DisplayName should same as given props', () => {
    expect(wrapper.find('.list-group-control-title').node.props.children).to.have.string('NEO0001');

    // If display name is not given it should display as 'unnamed'
    wrapper = shallow(<ClaimedBlindListItem />, { context });
    expect(wrapper.find('.list-group-control-title').node.props.children).to.equal('unnamed');
  });

  it('BlindRemote and BlindIcon should exist', () => {
    expect(wrapper.find(BlindRemote)).to.exist;
    expect(wrapper.find(BlindRemote)).to.have.length.of(1);

    expect(wrapper.find(BlindIcon)).to.exist;
    expect(wrapper.find(BlindIcon)).to.have.length.of(1);
  });

  it('Blind remote controls should be disabled if blind not connected', () => {
    wrapper.setState({
      bleName: 'NEO0001',
      rssi: null,
      connectionState: 'disconnected',
      displayPercentClosed: 0,
    });

    const blindRemoteProps = wrapper.find(BlindRemote).node.props;
    expect(blindRemoteProps.disableStop).to.be.true;
    expect(blindRemoteProps.disableClose).to.be.true;
    expect(blindRemoteProps.disableOpen).to.be.true;
    expect(blindRemoteProps.disableFavourite).to.be.true;
  });

  it('Blind remote controls should be enabled if blind is connected', () => {
    wrapper.setState({
      bleName: 'NEO0001',
      rssi: -1,
      connectionState: 'connected',
      displayPercentClosed: 0,
    });

    const blindRemoteProps = wrapper.find(BlindRemote).node.props;
    expect(blindRemoteProps.disableStop).to.be.false;
    expect(blindRemoteProps.disableClose).to.be.false;
    expect(blindRemoteProps.disableOpen).to.be.false;
    expect(blindRemoteProps.disableFavourite).to.be.false;
  });

  it('BlindIcon should be disabled if status not available', () => {
    expect(wrapper.find(BlindIcon)).to.exist;
    expect(wrapper.find(BlindIcon).node.props.disabled).to.be.true;
  });

  it('BlindIcon display status if available', () => {
    wrapper.setState({
      bleName: 'NEO0001',
      rssi: -1,
      connectionState: 'connected',
      status: { percentClosed: 50 },
    });

    expect(wrapper.find(BlindIcon)).to.exist;
    expect(wrapper.find(BlindIcon).node.props.disabled).to.be.false;
    expect(wrapper.find(BlindIcon).node.props.percentClosed).to.equal(50);
  });

  it('Detail view navigation icon should present', () => {
    expect(wrapper.find(HardwareKeyboardArrowRight)).to.exist;
    expect(wrapper.find(HardwareKeyboardArrowRight)).to.have.length.of(1);
  });

  it('It should have signal indicator', () => {
    expect(wrapper.find(SignalLevelIndicator)).to.exist;
    expect(wrapper.find(SignalLevelIndicator)).to.have.lengthOf(1);
  });
});
