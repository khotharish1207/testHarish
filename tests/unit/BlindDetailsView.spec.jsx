import React from 'react';
import { shallow } from 'enzyme';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from '../../src/style/muiThemes/neo';
import BlindDetailsView from '../../src/views/BlindDetailsView';
import BlindRemote from '../../src/components/BlindRemote';
import BlindTouchControls from '../../src/components/BlindTouchControls';
import FavPositionSlider from '../../src/components/FavPositionSlider';


describe('BlindDetailsView test cases', () => {
  let wrapper = null;
  const touchEvent = new Event('touchend');
  const context = { muiTheme: getMuiTheme(baseTheme), router: {} };
  const blind = {
    bleName: 'NEO0001',
    createdAt: 1482314639681,
    displayName: 'NEO0001',
    favouritePosition: 33,
    uid: '-KZVpaT9dbdXGzqIZ23Y',
  };

  const connected = {
    bleName: 'NEO0001',
    rssi: -1,
    connectionState: 'connected',
    status: { percentClosed: 33 },
  };

  beforeEach(() => {
    wrapper = shallow(<BlindDetailsView />, { context });
    wrapper.setState({ blind, favPosition: 33 });
  });

  afterEach(() => {
    wrapper = null;
  });

  it('BlindRemote and BlindTouchControls existance', () => {
    expect(wrapper.find(BlindRemote)).to.exist;
    expect(wrapper.find(BlindRemote)).to.have.length.of(1);

    expect(wrapper.find(BlindTouchControls)).to.exist;
    expect(wrapper.find(BlindTouchControls)).to.have.length.of(1);
  });

  it('Blind touch controls should be disabled if blind not connected', () => {
    const blindRemoteProps = wrapper.find(BlindTouchControls).node.props;
    expect(blindRemoteProps.disabled).to.be.true;
  });

  it('Blind touch controls should be enabled if blind is connected', () => {
    wrapper.setState({ device: connected });
    const blindRemoteProps = wrapper.find(BlindTouchControls).node.props;
    expect(blindRemoteProps.disabled).to.be.false;
    expect(blindRemoteProps.percentClosed).to.equal(33);
  });

  it('Blind remote controls should be disabled if blind not connected', () => {
    // wrapper.setState({ device: disconnected });
    const blindRemoteProps = wrapper.find(BlindRemote).node.props;
    expect(blindRemoteProps.disableStop).to.be.true;
    expect(blindRemoteProps.disableClose).to.be.true;
    expect(blindRemoteProps.disableOpen).to.be.true;
    expect(blindRemoteProps.disableFavourite).to.be.true;
  });

  it('Blind remote controls should be enabled if blind is connected', () => {
    wrapper.setState({ device: connected });
    const blindRemoteProps = wrapper.find(BlindRemote).node.props;
    expect(blindRemoteProps.disableStop).to.be.false;
    expect(blindRemoteProps.disableClose).to.be.false;
    expect(blindRemoteProps.disableOpen).to.be.false;
    expect(blindRemoteProps.disableFavourite).to.be.false;
  });

  it('FavPositionSlider existance', () => {
    expect(wrapper.find(FavPositionSlider)).to.exist;
    expect(wrapper.find(FavPositionSlider)).to.have.length.of(1);
  });

  it('FavPositionSlider value', () => {
    expect(wrapper.find(FavPositionSlider).node.props.defaultValue).to.equal(33);
  });

  it('Help messages', () => {
    wrapper.setState({ showHelp: true });

    wrapper.find(BlindRemote).simulate('open');
    expect(wrapper.find('h4').node.props.children).to.equal('OPEN - Completely opens the blind.');

    wrapper.find(BlindRemote).simulate('close');
    expect(wrapper.find('h4').node.props.children).to.equal('CLOSE - Completely closes the blind.');

    wrapper.find(BlindRemote).simulate('stop');
    // expect(wrapper.find('h4').at(1).node.props.children).to.equal('STOP - Stops the blind.');
    expect(wrapper.find('h4').node.props.children).to.equal('STOP - Stops the blind.');

    wrapper.find(BlindRemote).simulate('favourite');
    expect(wrapper.find('h4').node.props.children).to.equal('FAVORITE - Moves the blind to its favorite position.');

    wrapper.find('.remote-control-mu').simulate('touchend', touchEvent);
    expect(wrapper.find('h4').node.props.children).to.equal('STEP UP - Moves the blind up a small amount.');

    wrapper.find('.remote-control-md').simulate('touchend', touchEvent);
    expect(wrapper.find('h4').node.props.children).to.equal('STEP DOWN - Moves the blind down a small amount.');
  });
});
