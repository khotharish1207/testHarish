import React from 'react';
import { shallow } from 'enzyme';
import Select from 'react-select';

import TimeZoneInput from '../../src/components/TimeZoneInput';

describe('TimeZoneInput Component Test cases', () => {
  let wrapper = null;
  let spy = null;
  const tzHandleChange = TimeZoneInput.handleChange;

  beforeEach(() => {
    spy = chai.spy();
    wrapper = shallow(<TimeZoneInput onChange={spy} />);
  });

  afterEach(() => {
    TimeZoneInput.handleChange = tzHandleChange;
  });

  it('DOM rendering', () => {
    expect(wrapper.find(Select)).to.have.length(1);
  });

  it('should correctly call onChange', () => {
    TimeZoneInput.handleChange = spy;
    wrapper.simulate('change');
    expect(spy).to.have.been.called.once();
  });
});
