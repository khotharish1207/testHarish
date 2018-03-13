import React from 'react';
import { shallow } from 'enzyme';


import DayInput from '../../src/components/DayInput';

describe('DayInput test cases', () => {
  let wrapper = null;
  const onChangeSpy = chai.spy();
  const days = '0111110';
  const touchEvent = new Event('touchend');

  beforeEach(() => {
    wrapper = shallow(<DayInput
      onChange={onChangeSpy}
      days={days}
      readOnly={false}
    />);
  });

  afterEach(() => {
    wrapper = null;
  });

  it('should have all the week days', () => {
    // 7 week days + 1 wrapper div
    expect(wrapper.find('div')).to.have.length.of(8);
  });

  it('Should 5 of week days are selected', () => {
    // days = '0111110'
    expect(wrapper.find('.selected')).to.have.length.of(5);
  });

  it('Should week days are selected as per day state', () => {
    wrapper.setState({ day: '1111111' });
    expect(wrapper.find('.selected')).to.have.length.of(7);
  });

  it('Should toggle selection on click', () => {
    expect(wrapper.find('div').at(1).node.props.className).to.not.contain('selected');
    wrapper.find('div').at(1).simulate('touchend', touchEvent);

    expect(onChangeSpy).have.been.called.once;
    expect(wrapper.find('div').at(1).node.props.className).to.contain('selected');
  });

  it('Should not toggle selection on click if readonly', () => {
    wrapper = shallow(<DayInput
      onChange={onChangeSpy}
      days={days}
      readOnly
    />);

    expect(wrapper.find('div').at(1).node.props.className).to.not.contain('selected');
    wrapper.find('div').at(1).simulate('touchend', touchEvent);
    expect(wrapper.find('div').at(1).node.props.className).to.not.contain('selected');
  });
});
