import React from 'react';
import { shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import baseTheme from '../../src/style/muiThemes/neo';
import SceneForm from '../../src/components/SceneForm';
import SceneViewList from '../../src/components/SceneViewList';
import ScheduleForm from '../../src/components/ScheduleForm';

describe('SceneForm test cases', () => {
  let wrapper = null;
  const context = { muiTheme: getMuiTheme(baseTheme) };


  beforeEach(() => {
    wrapper = shallow(<SceneForm />, { context });
  });

  afterEach(() => {
    wrapper = null;
  });

  it('SceneViewList should be exist', () => {
    expect(wrapper.find(SceneViewList)).to.exist;
    expect(wrapper.find(SceneViewList)).to.have.length.of(1);
  });

  it('ScheduleForm should be exist', () => {
    expect(wrapper.find(ScheduleForm)).to.exist;
    expect(wrapper.find(ScheduleForm)).to.have.length.of(1);
  });
});
