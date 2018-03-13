import React from 'react';
import { shallow } from 'enzyme';

import AddNewSceneForm from '../../src/views/SceneAddView';
import SceneForm from '../../src/components/SceneForm';
import SceneRunModal from '../../src/components/SceneRunModal';

describe('AddNewSceneForm test cases', () => {
  let wrapper = null;
  const clickEvent = new Event('click');
  const context = { router: {} };
  let instance = null;

  beforeEach(() => {
    wrapper = shallow(<AddNewSceneForm />, { context });
    // instance = wrapper.instance();
  });

  afterEach(() => {
    wrapper = null;
    instance = null;
  });

  it('Default values', () => {
    expect(wrapper.state('displayName')).to.be.a('null');
    expect(wrapper.state('time')).to.equal(0);
    expect(wrapper.state('isScheduled')).to.equal(false);
    expect(wrapper.state('isRelative')).to.equal(false);
    expect(wrapper.state('relativeTo')).to.equal('sunrise');
    expect(wrapper.state('offset')).to.equal(0);
    expect(wrapper.state('days')).to.equal('0111110');
  });

  it('SceneForm should be exist', () => {
    expect(wrapper.find(SceneForm)).to.exist;
    expect(wrapper.find(SceneForm)).to.have.length.of(1);
  });

  it('SceneRunModal should open on click of run button ', () => {
    expect(wrapper.find(SceneRunModal)).to.exist;
    expect(wrapper.find(SceneRunModal)).to.have.length.of(0);
    wrapper.find('.run-scene').simulate('click', clickEvent);
    expect(wrapper.find(SceneRunModal)).to.have.length.of(1);
  });

  it.skip('SceneRunModal invoked on click of run button ', () => {
    // var spy = chai.spy(instance.openSceneRunModal);
    instance.openSceneRunModal = chai.spy();
    wrapper.find('.run-scene').simulate('click', clickEvent);
    expect(instance.openSceneRunModal).to.have.been.called();
  });
});
