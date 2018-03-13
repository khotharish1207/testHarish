import React from 'react';
import { shallow } from 'enzyme';

import SettingsForm from '../../src/components/SettingsForm';

describe('Settings Form test cases', () => {
  let wrapper = null;
  let submitSpy = null;
  let form = null;
  const submitEvent = new Event('submit');
  const context = { router: {} };

  beforeEach(() => {
    submitSpy = chai.spy();
    wrapper = shallow(<SettingsForm onSubmit={submitSpy} />, { context });
    form = wrapper.find('form');
  });

  afterEach(() => { wrapper = null; });

  it('Values should be validated after submit', () => {
    wrapper.setState({
      timeZone: { value: 'Fake/TimeZone' },
      setupCode: { value: 'ABC123' },
      lat: { value: 1 },
      lng: { value: 1 },
      location: { value: 'Fake' },
    });

    form.simulate('submit', submitEvent);
    expect(wrapper.state('timeZone').error).to.equal(undefined);
    expect(wrapper.state('setupCode').error).to.equal(undefined);
    expect(wrapper.state('lat').error).to.equal(undefined);
    expect(wrapper.state('lng').error).to.equal(undefined);
    expect(wrapper.state('location').error).to.equal(undefined);
  });

  it('Validation should add error if any', () => {
    wrapper.setState({
      timeZone: { value: '' },
      setupCode: { value: 'Test' },
      lat: { value: '' },
      lng: { value: '' },
      location: { value: '' },
    });

    form.simulate('submit', submitEvent);
    expect(wrapper.state('timeZone').error).to.equal('Timezone is required');
    expect(wrapper.state('location').error).to.equal('Invalid location');
    expect(wrapper.state('setupCode').error).to.equal('SetUp code must be 6 characters long');
  });

  it('Location validation error should occure if either of lat, lng or location is empty', () => {
    wrapper.setState({
      lat: { value: '' },
      lng: { value: '' },
      location: { value: '' },
    });
    form.simulate('submit', submitEvent);
    expect(wrapper.state('location').error).to.equal('Invalid location');

    wrapper.setState({
      lat: { value: 1 },
      lng: { value: '' },
      location: { value: '' },
    });
    form.simulate('submit', submitEvent);
    expect(wrapper.state('location').error).to.equal('Invalid location');

    wrapper.setState({
      lat: { value: '' },
      lng: { value: 1 },
      location: { value: '' },
    });
    form.simulate('submit', submitEvent);
    expect(wrapper.state('location').error).to.equal('Invalid location');

    wrapper.setState({
      lat: { value: '' },
      lng: { value: '' },
      location: { value: 'Fake' },
    });
    form.simulate('submit', submitEvent);
    expect(wrapper.state('location').error).to.equal('Invalid location');

    wrapper.setState({
      lat: { value: 1 },
      lng: { value: 1 },
      location: { value: 'Fake' },
    });
    form.simulate('submit', submitEvent);
    expect(wrapper.state('location').error).to.equal(undefined);
  });
});
