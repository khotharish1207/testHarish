import React from 'react';
import { shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RecoverForm from '../../src/components/RecoverForm';
import RecoverView from '../../src/views/RecoverView';
import baseTheme from '../../src/style/muiThemes/neo';

describe('RecoverView Test Case', () => {
  const context = { muiTheme: getMuiTheme(baseTheme), router: {} };
  let wrapper = null;
  let form = null;

  beforeEach(() => {
    wrapper = shallow(<RecoverView />, { context });
    form = wrapper.find(RecoverForm);
  });

  it('Access the dom', () => {
    expect(form).to.have.length(1);
    expect(form).not.to.equal(undefined);
  });
});
