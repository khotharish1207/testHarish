import __ from './i18n';

const roomPath = 'roomIcons/';

const iconMapping = {
  roomIcons: {
    genericRoom: { displayName: __('Generic Room'), fileName: [roomPath, 'Room_Filled.svg'].join('') },
    kitchen: { displayName: __('Kitchen Pot'), fileName: [roomPath, 'Kitchen.svg'].join('') },
    bedroom: { displayName: __('Double Bed'), fileName: [roomPath, 'Bed_Filled.svg'].join('') },
    livingRoom: { displayName: __('Armchair'), fileName: [roomPath, 'Living_Room.svg'].join('') },
    bathroom: { displayName: __('Shower & Tub'), fileName: [roomPath, 'Shower_and_Tub.svg'].join('') },
    office: { displayName: __('Desk Lamp'), fileName: [roomPath, 'Desk_Lamp.svg'].join('') },
    diningRoom: { displayName: __('Fork & Knife'), fileName: [roomPath, 'Dining_Room.svg'].join('') },
    tvRoom: { displayName: __('TV Screen'), fileName: [roomPath, 'Widescreen_TV.svg'].join('') },
  },
};

const getRoomIcon = (icon) => {
  if (iconMapping.roomIcons[icon]) {
    return iconMapping.roomIcons[icon];
  }
  return iconMapping.roomIcons.genericRoom;
};

export default iconMapping;
export { getRoomIcon };
