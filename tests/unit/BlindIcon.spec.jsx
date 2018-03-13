import React from 'react';
import { shallow } from 'enzyme';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from '../../src/style/muiThemes/neo';
import BlindIcon from '../../src/components/BlindIcon';


describe('BlindIcon test cases', () => {
  let wrapper = null;
  const context = { muiTheme: getMuiTheme(baseTheme) };

  beforeEach(() => {
    wrapper = shallow(<BlindIcon />, { context });
  });

  afterEach(() => {
    wrapper = null;
  });

  it('Blind status should as per value of "percentClosed" ', () => {
    expect(wrapper.find('div').at(4).node.props.style.height).to.equal('50%');

    wrapper = shallow(<BlindIcon
      percentClosed={40}
    />, { context });
    expect(wrapper.find('div').at(4).node.props.style.height).to.equal('40%');
  });

  it('Blind status should not be displayed if disabled', () => {
    expect(wrapper.find('div').at(4).node.props.style.display).to.equal('inline');

    wrapper = shallow(<BlindIcon
      percentClosed={40}
      disabled
    />, { context });
    expect(wrapper.find('div').at(4).node.props.style.display).to.equal('none');
  });
});
