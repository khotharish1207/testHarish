import React from 'react';
import { shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import appActions from '../../src/actions/appActions';
import LoginView from '../../src/views/LoginView';
import LoginForm from '../../src/components/LoginForm';
import baseTheme from '../../src/style/muiThemes/neo';

describe('LoginView test cases', () => {
  const originalLoginAction = appActions.login;
  const context = { muiTheme: getMuiTheme(baseTheme), router: {} };
  let wrapper = null;
  let loginForm = null;
  let spy = null;

  beforeEach(() => {
    wrapper = shallow(<LoginView />, { context });
    loginForm = wrapper.find(LoginForm);
  });

  afterEach(() => {
    appActions.login = originalLoginAction;
  });

  it('should display content', () => {
    expect(loginForm).to.have.length(1);
    expect(loginForm).not.to.equal(undefined);
  });

  it.skip('should correctly call the login action on submit form', () => {
    spy = chai.spy((cred) => {
      expect(cred.email).to.equal('test@gmail.com');
      expect(cred.password).to.equal('test123');
    });
    appActions.login = spy;

    loginForm.node.props.onSubmit({
      email: 'test@gmail.com',
      password: 'test123',
    });
    expect(spy).to.have.been.called.once();
  });
});
