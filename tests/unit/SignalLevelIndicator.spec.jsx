import React from 'react';
import { shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from '../../src/style/muiThemes/neo';
import SignalLevelIndicator from '../../src/components/SignalLevelIndicator';

describe('SignalLevelIndicator test cases', () => {
  let wrapper = null;
  const context = { muiTheme: getMuiTheme(baseTheme) };
  const signal = -50;

  beforeEach(() => {
    wrapper = shallow(<SignalLevelIndicator signal={signal} />, { context });
  });

  afterEach(() => {
    wrapper = null;
  });

  it('It should have  5 signal bars', () => {
    expect(wrapper.find('.signalBar')).to.have.length.of(5);
  });
});
