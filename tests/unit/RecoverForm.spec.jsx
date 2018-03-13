import React from 'react';
import { shallow } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RecoverForm from '../../src/components/RecoverForm';
import baseTheme from '../../src/style/muiThemes/neo';

describe('RecoverForm test cases', () => {
  const context = { muiTheme: getMuiTheme(baseTheme) };
  const submitEvent = new Event('submit');
  let submitSpy = null;
  let wrapper = null;
  let form = null;
  let textField = null;

  beforeEach(() => {
    submitSpy = chai.spy();
    wrapper = shallow(<RecoverForm onSubmit={submitSpy} />, { context });
    form = wrapper.find('form');
    textField = wrapper.find('TextField');
  });

  it('Access the dom', () => {
    expect(textField).to.have.length(1);
  });

  it('Should trigger a submit if all fields are valid', () => {
    wrapper.setState({
      email: { value: 'test@test.com' },
      action: 'recover',
    });
    form.simulate('submit', submitEvent);
    expect(wrapper.state('email').error).to.equal(undefined);
    expect(submitSpy).to.have.been.called;
  });

  it('Should add a validation error when the email is empty', () => {
    wrapper.setState({
      email: { value: '' },
    });
    form.simulate('submit', submitEvent);
    expect(wrapper.state('email').error).to.equal('Email is required');
    expect(submitSpy).to.have.been.called;
  });

  it('Should add a validation error when the email is invalid', () => {
    wrapper.setState({
      email: { value: 'test' },
    });
    form.simulate('submit', submitEvent);
    expect(wrapper.state('email').error).to.equal('Invalid Email');
    expect(submitSpy).to.have.been.called;
  });
});
