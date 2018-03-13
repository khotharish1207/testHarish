import React from 'react';
import { shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { TimePicker, Checkbox } from 'material-ui';
import baseTheme from '../../src/style/muiThemes/neo';
import ScheduleForm from '../../src/components/ScheduleForm';
import DayInput from '../../src/components/DayInput';


describe('ScheduleForm test cases', () => {
  let wrapper = null;
  const context = { muiTheme: getMuiTheme(baseTheme) };
  const onScheduleChangeSpy = chai.spy();
  const scene = {
    displayName: 'NEO0001',
    bleBlinds: {},
    time: 0,
    isScheduled: true,
    isRelative: false,
    relativeTo: 'sunrise',
    offset: 0,
    days: '0111110',
  };

  beforeEach(() => {
    wrapper = shallow(<ScheduleForm
      onScheduleChange={onScheduleChangeSpy}
      time={scene.time}
      isScheduled={scene.isScheduled}
      relativeTo={scene.relativeTo}
      isRelative={scene.isRelative}
      offset={scene.offset}
      days={scene.days}
    />, { context });
  });

  afterEach(() => {
    wrapper = null;
  });

  it('Checkbox', () => {
    expect(wrapper.find(Checkbox)).to.exist;
    expect(wrapper.find(Checkbox)).to.have.lengthOf(1);
  });

  it('TimePicker', () => {
    expect(wrapper.find(TimePicker)).to.exist;
    expect(wrapper.find(TimePicker)).to.have.lengthOf(1);
  });

  it('DayInput should present', () => {
    expect(wrapper.find(DayInput)).to.exist;
    expect(wrapper.find(DayInput)).to.have.lengthOf(1);
    expect(wrapper.find(DayInput).node.props.days).to.have.string(scene.days);
    expect(wrapper.find(DayInput).node.props.readOnly).to.be.false;
  });
});
