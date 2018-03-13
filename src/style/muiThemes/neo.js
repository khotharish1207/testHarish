import { white, darkBlack, fullBlack } from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

/**
 *  Light Theme is the default theme used in material-ui. It is guaranteed to
 *  have all theme variables needed for every component. Variables not defined
 *  in a custom theme will default to these values.
 */

const lightBlue = '#00B7DF'; // rgb(0, 183, 223)
const darkBlue = '#1C8BC3'; // rgb(28, 139, 195)
const orange = '#FF8C00'; // rgb(255, 140, 0)
const darkGray = '#6E6E70'; // rgb(110, 110, 112)
const lightGray = '#BEBEBE'; // rgb(190, 190, 190)
const green = '#00CC4A'; // rgb(0, 204, 74)
const red = '#F21C24'; // rgb(242, 28, 36)

export default {
// Base
  spacing,
  fontFamily: 'Klavika',
  palette: {
    primary1Color: lightBlue, // cyan500,
    primary2Color: darkBlue, // cyan700,
    primary3Color: darkGray, // grey400,
    accent1Color: darkBlue, // pinkA200,
    accent2Color: lightGray, // grey100,
    accent3Color: orange, // grey500,
    textColor: darkGray,
    text1Color: green,
    text2Color: red,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: lightGray, // grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: lightBlue, // cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },

  appBar: {
    height: 50,
  },

  textField: {
    errorColor: red,
  },

  flatButton: {
    textColor: darkGray,
    primaryTextColor: lightBlue,
    secondaryTextColor: white,
  },

  raisedButton: {
    color: darkGray,
    textColor: white,
    primaryColor: lightBlue,
    primaryTextColor: white,
    secondaryColor: darkBlue,
    secondaryTextColor: white,
  },

  drawerHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: darkGray,
    color: white,
    paddingTop: 5,
    height: 50,
  },

  invertedTextField: {
    inputStyle: {
      color: white,
    },
    underlineStyle: {
      borderColor: darkBlue,
    },
    underlineFocusStyle: {
      borderColor: white,
    },
    hintStyle: {
      color: darkBlue,
    },
  },

  listItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },

// Views
  invertedView: {
    backgroundColor: lightBlue,
    color: white,
  },

  invertedViewBlueItalic: {
    color: '#0071BC',
    fontStyle: 'italic',
    fontWeight: 600,
  },

// Remote Control icons for BlindRemote
  remoteControlIcon: {
    fill: '#08b9e0',
    width: 35,
  },

  blindTouchControls: {
    width: 100,
    height: 150,
    blindColor: darkGray,
    overlayColor: lightBlue,
    overlayOpacity: 0.5,
    commandMsgColor: lightBlue,
    percentMsgColor: lightGray,
    borderColor: lightGray,
    borderWidth: 6,
    frameWidth: 4,
    fontSize: 16,
  },

  blindIcon: {
    width: 40,
    height: 60,
    blindColor: darkGray,
    borderColor: lightGray,
    borderWidth: 4,
    frameWidth: 2,
  },

  favPositionSlider: {
    textStyle: {
      textAlign: 'center',
      margin: 5,
      color: lightBlue,
      fontSize: 16,
    },
    sliderStyle: {
      height: 150,
      float: 'left',
    },
  },

  tab: {
    backgroundColor: white,
    color: lightBlue,
    border: `1px solid ${lightGray}`,
  },

  sceneViewList: {
    height: 'calc(100vh - 146px)',
    overflow: 'auto',
  },

  blindDetailsView: {
    height: 'calc(100vh - 50px)',
    overflow: 'auto',
  },

  signal: {
    width: 30,
    height: 19,
    margin: '0 0 0 4px',
    display: 'inline-flex',
    alignItems: 'flex-end',
  },

  battery: {
    border: `1px solid ${lightGray}`,
    width: 30,
    height: 19,
    margin: '1px 4px',
    marginRight: 15,
  },
};
