'use strict'

const fs = require('fs');
const path = require('path');
const et = require('elementtree');

const ENV = require('./env');

function createVersionCode(version) {
  const splitVersion = version.split('.');
  if (splitVersion.length > 3) {
    console.log("Warning - npm package version has more than 3 digits!");
    console.log("Resulting versionCode will cause problems when building on Android.");
  }
  return splitVersion.join('');
}

let src = 'index.html';
if (ENV.buildType === 'development') {
  src = `http://localhost:${ENV.port}/${src}`;
}
const config = path.resolve('./config.xml');

try {
  const configXML = new et.ElementTree(et.XML(fs.readFileSync(config, 'utf-8')));
  const widget = configXML.getroot();
  const version = ENV.version;
  const versionCode = createVersionCode(version);
  console.log(`Setting config.xml version to ${version} and versionCode to ${versionCode}`);
  widget.attrib.version = version;
  widget.attrib.versionCode = versionCode;

  widget._children.forEach(function(el) {
    if (el.tag === 'platform') {
      if (el.attrib.name === 'android' || el.attrib.name === 'ios') {
        el._children.forEach(function(child) {
          // Point index file to localhost
          if (child.tag === 'content') {
            console.log('Setting ' + el.attrib.name + ' src to ' + src)
            child.attrib.src = src;
          }
        });
      }
    }
  });
  fs.writeFileSync(config, configXML.write({ indent: 4 }), 'utf-8');

} catch (err) {
  console.error('ERROR: Could not replace content src in: ' + config, err);
  process.exit(1);
}
