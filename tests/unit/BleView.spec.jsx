import React from 'react';
import { shallow } from 'enzyme';
import BleView from '../../src/views/BleView';

import UnclaimedBleBlindListItem from '../../src/components/UnclaimedBlindListItem';
import ClaimedBlindsListItem from '../../src/components/ClaimedBlindListItem';
import ClaimDeviceModel from '../../src/components/BlindClaimModal';
import LoadingIndicator from '../../src/components/LoadingIndicator';


describe('BleView test cases', () => {
  let wrapper = null;

  const devices = {
    '00:11:22:33:44:55': {
      name: 'Disconnected Blind',
      rssi: -1,
      connectionState: 'visible',
    },
    '00:11:22:33:44:AA': {
      name: 'Connected Blind',
      rssi: -1,
      connectionState: 'connected',
    },
  };

  const bleBlinds = {
    '-KZVpaT9dbdXGzqIZ23Y': {
      bleName: 'NEO0001',
      createdAt: 1482314639681,
      displayName: 'NEO0001',
      favouritePosition: 33,
      uid: '-KZVpaT9dbdXGzqIZ23Y',
    },
  };

  beforeEach(() => {
    wrapper = shallow(<BleView />);
  });

  it('List should update after scan complete', () => {
    expect(wrapper.find('.none-in-list')).to.have.length.of(1);
    expect(wrapper.find(UnclaimedBleBlindListItem)).to.have.length.of(0);
    wrapper.setState({ unclaimed: devices });
    expect(wrapper.find(UnclaimedBleBlindListItem)).to.have.length.of(2);
  });

  it('Should display Claimed Blinds on Location fetch', () => {
    wrapper.setState({ bleBlinds });
    expect(wrapper.find(ClaimedBlindsListItem)).to.have.length.of(1);
  });

  it('Unclaimed blinds should not be displayed if showUnclaimed is not set', () => {
    wrapper.setState({ unclaimed: devices });
    expect(wrapper.find(UnclaimedBleBlindListItem)).to.have.length.of(2);

    wrapper.setState({
      unclaimed: devices,
      showUnclaimed: false,
    });
    expect(wrapper.find(UnclaimedBleBlindListItem)).to.have.length.of(0);
  });

  it('Should display LoadingIndicator untill fetch complete', () => {
    expect(wrapper.find(LoadingIndicator)).to.exist;

    // isFetchingLocation: true
    expect(wrapper.find(LoadingIndicator)).to.have.length.of(1);
    // isFetchingLocation: false
    wrapper.setState({ isFetchingLocation: false });
    expect(wrapper.find(LoadingIndicator)).to.have.length.of(0);
  });

  it('Should display ClaimDeviceModel on claiming start', () => {
    expect(wrapper.find(ClaimDeviceModel)).to.exist;
    expect(wrapper.find(ClaimDeviceModel)).to.have.length.of(0);

    wrapper.setState({
      isClaiming: true,
      claimDeviceId: '00:11:22:33:44:55',
    });
    expect(wrapper.find(ClaimDeviceModel)).to.have.length.of(1);
    expect(wrapper.find(ClaimDeviceModel).node.props.bleId).to.equal('00:11:22:33:44:55');
  });
});
