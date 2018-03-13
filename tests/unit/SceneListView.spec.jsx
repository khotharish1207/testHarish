import React from 'react';
import { shallow } from 'enzyme';
import { FloatingActionButton } from 'material-ui';

import SceneListItem from '../../src/components/SceneListItem';
import SceneListView from '../../src/views/SceneListView';
import SceneSyncModal from '../../src/components/SceneSyncModal';

import LoadingIndicator from '../../src/components/LoadingIndicator';

describe('SceneListView test cases', () => {
  let wrapper = null;
  const touchEvent = new Event('touchend');
  const context = { router: {} };
  const scenes = {
    '-KZfuqcC4Btv63Lw4HsK': {
      bleBlinds: {},
      createdAt: 1482500565729,
      days: '0111110',
      displayName: 'first',
      isRelative: false,
      isScheduled: true,
      offset: 0,
      relativeTo: 'sunrise',
      time: 0,
      uid: '-KZfuqcC4Btv63Lw4HsK',
    },
    '-KZuQu1CnPhcZDFPz-pG': {
      bleBlinds: {},
      createdAt: 1482744111381,
      days: '0111110',
      displayName: 'second',
      isRelative: false,
      isScheduled: false,
      offset: 0,
      relativeTo: 'sunrise',
      time: 0,
      uid: '-KZuQu1CnPhcZDFPz-pG',
    },
  };

  beforeEach(() => {
    wrapper = shallow(<SceneListView />, { context });
  });

  afterEach(() => {
    wrapper = null;
  });

  it('List should update after fetch complete', () => {
    expect(wrapper.find('.none-in-list')).to.have.length.of(1);
    expect(wrapper.find(SceneListItem)).to.have.length.of(0);
    wrapper.setState({ scenes });
    expect(wrapper.find(SceneListItem)).to.have.length.of(2);
  });

  it('Should display LoadingIndicator untill fetch complete', () => {
    expect(wrapper.find(LoadingIndicator)).to.exist;

    // isFetchingLocation: true
    expect(wrapper.find(LoadingIndicator)).to.have.length.of(1);
    // isFetchingLocation: false
    wrapper.setState({ isFetchingLocation: false });
    expect(wrapper.find(LoadingIndicator)).to.have.length.of(0);
  });

  it('Action button for sync blind should be bouncing and red if there are unsynced Changes ', () => {
    expect(wrapper.find(FloatingActionButton)).to.exist;
    expect(wrapper.find(FloatingActionButton).at(1).node.props.className).to.be.a('null');
    expect(wrapper.find(FloatingActionButton).at(1).node.props.backgroundColor).to.be.a('null');
    wrapper.setState({ unsyncedChanges: true });
    expect(wrapper.find(FloatingActionButton).at(1).node.props.className).to.equal('bounce');
    expect(wrapper.find(FloatingActionButton).at(1).node.props.backgroundColor).to.equal('red');
  });

  it('SceneSyncModal shouldopen on sync blind action', () => {
    expect(wrapper.find(SceneSyncModal)).to.exist;
    expect(wrapper.find(SceneSyncModal)).to.have.length.of(0);
    wrapper.find(FloatingActionButton).at(1).simulate('touchend', touchEvent);
    expect(wrapper.find(SceneSyncModal)).to.have.length.of(1);
  });

  it('Action buttons and label', () => {
    let actionButtons = wrapper.find('.sceneViewBottomButtonsDiv');
    expect(actionButtons.find('div').at(1).find('span').node.props.children).to.equal('Create Scene');
    expect(actionButtons.find('div').at(2).find('span').node.props.children).to.equal('Sync Blinds');

    wrapper.setState({ unsyncedChanges: true });
    actionButtons = wrapper.find('.sceneViewBottomButtonsDiv');
    expect(actionButtons.find('div').at(2).find('span').node.props.children).to.equal('Sync Required');
  });
});
