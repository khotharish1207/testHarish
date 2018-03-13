# Neo Smart Blinds (BLE enabled) Mobile App

## Description

New repository and build system for the Neo Smart Blinds App to enable use of Bluetooth.

Visit the [Trello Task Board](https://trello.com/invite/b/JZC8EuAW/7decba7a01ec42aff76128b6f7ffeafe/ble-hybrid-app)!

## Backend - Auth and Data Storage

This app is currently using Firebase for auth and data storage. All interactions with Firebase should be limited to functions in `utils/authUtils.js` and `utils/dbUtils.js`. This defines a clean interface, keeps the app modular, and will facilitate a change in backend technology if needed.

For read/write rules see [this repository](https://bitbucket.org/neosmartblinds/firebase-backend). 

There are two backends: `development` and `production`. By default development is used. To change it to production use:

```
npm config set nsb:database=production
```

## Installation (Node 6.6 or higher)

Ensure you have Cordova and Phonegap globally installed

```
npm install -g cordova phonegap
```

then run

```
npm install && npm run init-cordova
```

## Usage

### Run the app in the browser / simulator

Run this to start the development webpack server:

```
npm start
```

You can then open the app in your browser by visiting [localhost:8080](http://localhost:8080). You can specify the port by changing the npm config variable via:

```
npm config set nsb:port=<value>
```

You can then open it in the iOS/Android Simulator *in another console/terminal* using:

```
cordova run <platform>
```

In this mode, the app will live-reload changes to React components using [react-hot-loader](https://github.com/gaearon/react-hot-loader) and CSS changes using the Webpack CSS loader.

Since certain stylistic assets are platform dependent, you can specify the platform by changing the npm config variable via:

```
npm config set nsb:platform=ios
```

This holds true for all the subsequent npm scripts. The default config value for `platform` is `android`.

### Run the app in the Phonegap Developer App

To run webpack in watch mode and serve the result from the Phonegap dev server so that it can be used by the Phonegap developper app use:

```
npm run serve
```

This pipes the output from webpack to the phonegap dev server. However, it does not include the webpack hot module replacement.

### Linting
Linting is setup to follow the AirBnB style guide for Javascript and React. Please verify you have no errors by running

```
npm run lint
```

prior to committing your code.

### Testing
Tests are run with Karma using Mocha/Chai and [AirBnB's Enzyme](http://airbnb.io/enzyme/index.html). To run tests in watch mode use:

```
npm test
```

Please ensure all tests are passing, and that your code is sufficiently covered before committing changes.

### Build the App

First, to build the app without the development hot module reloading server, using minification and other code optimization, run:

```
npm run prepare 
```

This will switch your `config.xml` file to production mode, build the app bundle to `/www` using Webpack, and call `cordova prepare <platform>`. Then:

```
npm run pgb
```

Will build the app using Phone Gap Build. Finally:

```
npm run fetch 
```

will download the app package (.apk or .ipa) and display an installation QR code that can be used to load the app on an Android or (pre-listed) iOS device.

A shortcut for these three steps is:

```
npm run build
```

**IMPORTANT NOTE** Make the app is configured to use to use the production backend before publishing. Details in section `backend` above.