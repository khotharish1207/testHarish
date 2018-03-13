import React from 'react';
import { shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import LoginForm from '../../src/components/LoginForm';
import baseTheme from '../../src/style/muiThemes/neo';

describe('LoginForm test case ', () => {
  const context = { muiTheme: getMuiTheme(baseTheme) };
  const email = 'test@mail.com';
  const pass = 'testPassword';

  let form = null;
  let textField = null;
  let emailInput = null;
  let passwordInput = null;
  let submitButton = null;
  let submitSpy = null;
  let wrapper = null;

  beforeEach(() => {
    submitSpy = chai.spy();
    wrapper = shallow(<LoginForm onSubmit={submitSpy} />, { context });
    form = wrapper.find('form');
    textField = wrapper.find('TextField');
    emailInput = textField.get(0);
    passwordInput = textField.get(1);
    submitButton = wrapper.find('button[type="submit"]');
  });

  it('Access the dom', (done) => {
    expect(textField).to.have.length(2);
    expect(emailInput).not.to.equal(undefined);
    expect(passwordInput).not.to.equal(undefined);
    expect(submitButton).not.to.equal(undefined);
    done();
  });

  it('Should trigger a submit if all fields are valid', (done) => {
    wrapper.setState({
      email: { value: email },
      password: { value: pass },
    });
    form.simulate('submit', new Event('submit'));
    expect(wrapper.state('email').error).to.equal(undefined);
    expect(wrapper.state('password').error).to.equal(undefined);
    expect(submitSpy).to.have.been.called.once;
    done();
  });

  it('Should add a validation error when the email is invalid', (done) => {
    wrapper.setState({
      email: { value: 'email' },
      password: { value: '' },
    });
    form.simulate('submit', new Event('submit'));
    expect(wrapper.state('email').error).to.equal('Invalid Email');
    expect(wrapper.state('password').error).to.equal('Password is required');
    expect(submitSpy).to.have.been.called;
    done();
  });
});
