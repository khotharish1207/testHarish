import React from 'react';
import { shallow } from 'enzyme';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from '../../src/style/muiThemes/neo';
import SceneViewList from '../../src/components/SceneViewList';
import SceneViewListItem from '../../src/components/SceneViewListItem';

describe('SceneViewList test cases', () => {
  let wrapper = null;
  const context = { muiTheme: getMuiTheme(baseTheme), router: {} };
  const onBleChangeSpy = chai.spy();
  const blinds = {};
  const bleBlinds = { '-KZVpaT9dbdXGzqIZ23Y': { included: true, position: 50 } };

  beforeEach(() => {
    wrapper = shallow(<SceneViewList
      blinds={blinds}
      onBleChange={onBleChangeSpy}
    />, { context });
  });

  afterEach(() => {
    wrapper = null;
  });

  it('It should show "You have not claimed any blind." if user haved claimed any blind', () => {
    // No Blinds
    expect(wrapper.find('.none-in-list')).to.exist;
    expect(wrapper.find('.none-in-list')).to.have.length.of(1);
  });

  it('It should show list of claimed blind', () => {
    wrapper.setState({ bleBlinds });
    expect(wrapper.find(SceneViewListItem)).to.exist;
    expect(wrapper.find(SceneViewListItem)).to.have.length.of(1);
  });
});
