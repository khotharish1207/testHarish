
// Utils to facilitate navigation. (Replaces BaseComponent approach)

import { hashHistory } from 'react-router';

import routes from '../routes';

export function navTo(view, ...params) {
  const path = routes(view, ...params);
  hashHistory.push(path);
}

export function navCallback(view, ...params) {
  return () => {
    const path = routes(view, ...params);
    hashHistory.push(path);
  };
}

export function goBack() {
  hashHistory.goBack();
}
