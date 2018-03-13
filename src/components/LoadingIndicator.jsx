import React from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';


export default class LoadingIndicator extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
  };

  shouldComponentMount() {
    return false;
  }

  render() {
    const style = {
      container: {
        position: 'absolute',
        left: '44%',
        top: '50%',
      },
      refresh: {
        display: 'inline-block',
        position: 'relative',
      },
    };
    const loadingColor = this.context.muiTheme.palette.primary1Color;

    return (
      <div style={style.container}>
        <RefreshIndicator
          size={50}
          left={0}
          top={0}
          loadingColor={loadingColor}
          status="loading"
          style={style.refresh}
        />
      </div>
    );
  }
}
