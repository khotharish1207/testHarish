import React from 'react';
import { shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RegisterView from '../../src/views/RegisterView';
import RegisterForm from '../../src/components/RegisterForm';
import baseTheme from '../../src/style/muiThemes/neo';

describe('RegisterView test case ', () => {
  const context = { muiTheme: getMuiTheme(baseTheme), router: {} };
  let wrapper = null;
  let registerForm = null;

  beforeEach(() => {
    wrapper = shallow(<RegisterView />, { context });
    registerForm = wrapper.find(RegisterForm);
  });

  it('Access the dom', () => {
    expect(registerForm).not.to.equal(undefined);
  });
});
