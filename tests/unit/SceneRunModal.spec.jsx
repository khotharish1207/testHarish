import React from 'react';
import { shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from '../../src/style/muiThemes/neo';
import SceneRunModal from '../../src/components/SceneRunModal';

describe('SceneRunModal test cases', () => {
  let wrapper = null;
  const closeSceneModalSpy = chai.spy();
  const context = { muiTheme: getMuiTheme(baseTheme) };
  const scene = {
    bleBlinds: {
      '-KZVpaT9dbdXGzqIZ23Y': 50,
    },
    createdAt: '1482500565729',
    days: '0111110',
    displayName: 'TestScene',
    isRelative: false,
    isScheduled: true,
    offset: 0,
    relativeTo: 'sunrise',
    time: 0,
    uid: '-KZfuqcC4Btv63Lw4HsK',
  };

  const bleBlindInfoList = { '-KZVpaT9dbdXGzqIZ23Y': { displayName: 'NEO00001' } };

  const bleBlindInfoListConncted = {
    '-KZVpaT9dbdXGzqIZ23Y': {
      displayName: 'NEO00001',
      device: {
        connectionState: 'connected',
      },
    },
  };

  beforeEach(() => {
    wrapper = shallow(<SceneRunModal
      open
      sceneName={scene.displayName}
      runningLists={scene.bleBlinds}
      closeSceneModal={closeSceneModalSpy}
    />, { context });
  });

  afterEach(() => {
    wrapper = null;
  });

  it('DisplayName should same as given props', () => {
    expect(wrapper.find('h4').node.props.children).to.have.string(scene.displayName);
  });

  it('Scene run status', () => {
    wrapper.setState({ bleBlindInfoList });
    expect(wrapper.find('.sceneBlindList').at(1).node.props.children).to.have.string('Disconnected');

    wrapper.setState({ bleBlindInfoList: bleBlindInfoListConncted });
    expect(wrapper.find('.sceneBlindList').at(1).node.props.children).to.have.string('Sent');
  });
});
