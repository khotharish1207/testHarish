import React from 'react';
import { shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from '../../src/style/muiThemes/neo';
import BatteryLevelIndicator from '../../src/components/BatteryLevelIndicator';

describe('BatteryLevelIndicator test cases', () => {
  let wrapper = null;
  const context = { muiTheme: getMuiTheme(baseTheme) };
  const signal = 50;

  beforeEach(() => {
    wrapper = shallow(<BatteryLevelIndicator
      battery={signal}
      disabled={false}
    />, { context });
  });

  afterEach(() => {
    wrapper = null;
  });

  it('It should show battery life same as battery prop', () => {
    expect(wrapper.find('div').at(1).node.props.style.width).to.equal(`${signal}%`);
  });

  it('It should show battery life in green if more than 20%', () => {
    expect(wrapper.find('div').at(1).node.props.style.backgroundColor).to.equal('#00CC4A');
  });

  it('It should show battery life in red if less than 20%', () => {
    wrapper = shallow(<BatteryLevelIndicator
      battery={15}
      disabled={false}
    />, { context });

    const batteryLifeStyle = wrapper.find('div').at(1).node.props.style;
    expect(batteryLifeStyle.width).to.equal('15%');
    expect(batteryLifeStyle.backgroundColor).to.equal('#F21C24');
  });


  it('It should not show battery life if component disabled', () => {
    wrapper = shallow(<BatteryLevelIndicator
      battery={15}
      disabled
    />, { context });
    expect(wrapper.find('div').at(1).node.props.style.backgroundColor).to.equal('transparent');
  });
});
