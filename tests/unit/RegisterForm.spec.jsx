import React from 'react';
import { shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RegisterForm from '../../src/components/RegisterForm';
import TimeZoneInput from '../../src/components/TimeZoneInput';
import baseTheme from '../../src/style/muiThemes/neo';

describe('RegisterForm test case ', () => {
  const context = { muiTheme: getMuiTheme(baseTheme), router: {}, history: {} };
  const event = new Event('submit');
  let form = null;
  let textField = null;
  let submitSpy = null;
  let wrapper = null;

  beforeEach(() => {
    submitSpy = chai.spy();
    wrapper = shallow(<RegisterForm onSubmit={submitSpy} />, { context });
    form = wrapper.find('form');
    textField = wrapper.find('TextField');
  });

  it('Access the dom', () => {
    expect(textField).to.have.length(5);
    expect(wrapper.find(TimeZoneInput)).to.exist;
  });

  it('Should trigger a submit if all fields are valid', () => {
    wrapper.setState({
      userName: { value: 'Test Name' },
      email: { value: 'test@mail.com' },
      password: { value: 'testPassword' },
      confirm: { value: 'testPassword' },
      timezone: { value: 'fake/timeZone' },
      location: { value: 'fake/location' },
      lat: { value: '123' },
      lng: { value: '123' },
    });
    form.simulate('submit', event);
    expect(wrapper.state('userName').error).to.equal(undefined);
    expect(wrapper.state('email').error).to.equal(undefined);
    expect(wrapper.state('password').error).to.equal(undefined);
    expect(wrapper.state('confirm').error).to.equal(undefined);
    expect(wrapper.state('timezone').error).to.equal(undefined);
    expect(wrapper.state('location').error).to.equal(undefined);
    expect(submitSpy).to.have.been.called;
  });

  it('Should add a validation error when the password is empty', () => {
    wrapper.setState({
      password: { value: '' },
      confirm: { value: '' },
    });
    form.simulate('submit', event);
    expect(submitSpy).to.have.been.called;
    expect(wrapper.state('password').error).to.equal('Password is required');
  });

  it('Should add a validation error when the password is short', () => {
    wrapper.setState({
      password: { value: 'Pass' },
    });
    form.simulate('submit', event);
    expect(submitSpy).to.have.been.called;
    expect(wrapper.state('password').error).to.equal('Password must be at least 6 characters');
  });

  it('Should add a validation error when the passwords dont match', () => {
    wrapper.setState({
      password: { value: 'testPass' },
      confirm: { value: 'TestPass' },
    });
    form.simulate('submit', event);
    expect(submitSpy).to.have.been.called;
    expect(wrapper.state('confirm').error).to.equal('Passwords do not match');
  });

  it('Should add a validation error when the email is invalid', () => {
    wrapper.setState({
      email: { value: 'email' },
    });
    form.simulate('submit', event);
    expect(submitSpy).to.have.been.called;
    expect(wrapper.state('email').error).to.equal('Invalid Email');
  });

  it('Should add a validation error when the latitude and longitude are empty', () => {
    wrapper.setState({
      lat: { value: '' },
      lng: { value: '' },
    });
    form.simulate('submit', event);
    expect(submitSpy).to.have.been.called;
    expect(wrapper.state('location').error).to.equal('Invalid location');
  });

  it('Should add a validation error when the latitude or longitude are empty', () => {
    wrapper.setState({
      lat: { value: '123' },
      lng: { value: '' },
    });
    form.simulate('submit', event);
    expect(submitSpy).to.have.been.called;
    expect(wrapper.state('location').error).to.equal('Invalid location');

    wrapper.setState({
      lat: { value: '' },
      lng: { value: '123' },
    });
    form.simulate('submit', event);
    expect(submitSpy).to.have.been.called;
    expect(wrapper.state('location').error).to.equal('Invalid location');
  });
});
