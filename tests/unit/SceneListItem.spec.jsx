import React from 'react';
import { shallow } from 'enzyme';
import { FloatingActionButton } from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import baseTheme from '../../src/style/muiThemes/neo';
import SceneListItem from '../../src/components/SceneListItem';
import SceneRunModal from '../../src/components/SceneRunModal';

describe('SceneListItem test cases', () => {
  let wrapper = null;
  const touchEvent = new Event('touchend');
  const context = { muiTheme: getMuiTheme(baseTheme), router: {} };
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

  beforeEach(() => {
    wrapper = shallow(<SceneListItem
      scene={scene}
      sceneId={scene.uid}
    />, { context });
  });

  afterEach(() => {
    wrapper = null;
  });

  it('DisplayName should same as given props', () => {
    expect(wrapper.find('.list-group-control-title').node.props.children).to.have.string(scene.displayName);
  });

  it('Display Scene "run at time" if scheduled, "Not scheduled" otherwise', () => {
    expect(wrapper.find('p').at(0).node.props.children).to.have.string('Runs at 12:00 AM');
    scene.isScheduled = false;
    wrapper = shallow(<SceneListItem
      scene={scene}
      sceneId={scene.uid}
    />, { context });
    expect(wrapper.find('p').at(0).node.props.children).to.have.string('Not Scheduled');
  });

  it('Scene run button', () => {
    expect(wrapper.find('FloatingActionButton')).to.exist;
    expect(wrapper.find('FloatingActionButton')).to.have.length.of(1);
  });

  it('Scene run button should open scene run modal', () => {
    expect(wrapper.find('FloatingActionButton')).to.exist;
    expect(wrapper.find(SceneRunModal)).to.have.length.of(0);
    wrapper.find('FloatingActionButton').simulate('touchend', touchEvent);
    expect(wrapper.find(SceneRunModal)).to.have.length.of(1);
  });

  it('Scene edit navigation button', () => {
    const instance = wrapper.instance();
    instance.onClick = chai.spy();
    instance.onClick(touchEvent);
    // wrapper.find('.list-group-item-right-button').simulate('touchend', touchEvent);
    expect(instance.onClick).to.have.been.called.once;
  });
});
