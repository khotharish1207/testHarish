import React from 'react';
import { shallow } from 'enzyme';
import { Slider, Checkbox } from 'material-ui';
import BlindIcon from '../../src/components/BlindIcon';
import SceneViewListItem from '../../src/components/SceneViewListItem';

describe('SceneViewListItem test cases', () => {
  let wrapper = null;
  const onChangeSpy = chai.spy();
  const scene = { included: true, position: 50 };

  beforeEach(() => {
    wrapper = shallow(<SceneViewListItem
      onChange={onChangeSpy}
      scene={scene}
    />);
    wrapper.setState({ displayName: 'NEO0001' });
  });

  afterEach(() => {
    wrapper = null;
  });

  it('DisplayName should same as given props', () => {
    expect(wrapper.find('.list-group-control-title').node.props.children).to.have.string('NEO0001');
  });

  it('BlindIcon should be exist', () => {
    expect(wrapper.find(BlindIcon)).to.exist;
    expect(wrapper.find(BlindIcon)).to.have.lengthOf(1);
  });

  it('Slider should be exist', () => {
    const slider = wrapper.find(Slider);
    expect(slider).to.exist;
    expect(slider).to.have.lengthOf(1);
    expect(slider.node.props.value).to.equal(50);

    slider.simulate('change', new Event('change'));
    expect(onChangeSpy).to.have.been.called();
  });

  it('Checkbox should be exist', () => {
    const checkbox = wrapper.find(Checkbox);
    expect(checkbox).to.exist;
    expect(checkbox).to.have.lengthOf(1);
    expect(wrapper.state('blind').included).to.be.true;
    checkbox.simulate('check');
    expect(onChangeSpy).to.have.been.called();
  });
});
