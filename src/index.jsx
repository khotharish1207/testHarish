import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Application from './views/Application';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import Recoverview from './views/RecoverView';
import BleView from './views/BleView';
import BlindDetailsView from './views/BlindDetailsView';
import MapView from './views/MapView';
import SettingsView from './views/SettingsView';
import SandboxView from './views/SandboxView';
import SceneListView from './views/SceneListView';
import SceneAddView from './views/SceneAddView';
import SceneView from './views/SceneView';

import routes from './routes';

import './style/stylesheets/bootstrap.min.css';
import './style/stylesheets/base.css';
import './style/stylesheets/sceneView.css';
import './style/stylesheets/list.css';

injectTapEventPlugin();

// Organize routes alphabetically to match file order.
render((
  <Router history={hashHistory}>
    <Route path="/" component={Application}>
      <IndexRoute component={BleView} />
      <Route path={routes('BlindDetailsView')} component={BlindDetailsView} />
      <Route path={routes('LoginView')} component={LoginView} />
      <Route path={routes('MapView')} component={MapView} />
      <Route path={routes('RecoverView')} component={Recoverview} />
      <Route path={routes('RegisterView')} component={RegisterView} />
      <Route path={routes('SandboxView')} component={SandboxView} />
      <Route path={routes('SceneAddView')} component={SceneAddView} />
      <Route path={routes('SceneListView')} component={SceneListView} />
      <Route path={routes('SceneView')} component={SceneView} />
      <Route path={routes('SettingsView')} component={SettingsView} />
    </Route>
  </Router>
), document.getElementById('app'));
