
// Helper to manage routes.
// Organize routes alphabetically to match file order.

export default function routes(view, ...params) {
  switch (view) {

    case 'BleView':
      return '/';

    case 'BlindDetailsView': {
      const id = params.length > 0 ? params[0] : ':id';
      return `/blind/${id}`;
    }

    case 'LoginView':
      return '/login';

    case 'MapView':
      return '/map';

    case 'RecoverView':
      return '/recover';

    case 'RegisterView':
      return '/register';

    case 'SandboxView':
      return '/sandbox';

    case 'SceneAddView':
      return '/scene-add';

    case 'SceneListView':
      return '/scenes';

    case 'SceneView': {
      const id = params.length > 0 ? params[0] : ':id';
      return `/scene/${id}`;
    }

    case 'SettingsView':
      return '/settings';

    default:
      console.error('no view specified');
      return '/';
  }
}
