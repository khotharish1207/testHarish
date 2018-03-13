'use strict';

// Dependencies
const fs = require('fs');
const request = require('request');
const qrcode = require('qrcode-terminal');

// Globals
const pgbAppId = 2276219;
const pgbBaseUrl = 'https://build.phonegap.com/api/v1';
const pgbToken = '03cfbef9104ea30a62506ab923';

function getAppInfo(cb) {
  const url = `${pgbBaseUrl}/apps/${pgbAppId}?access_token=${pgbToken}`;
  request.get({ url, json: true }, (err, resp) => {
    cb(resp.body);
  });
}

function downloadFile(url, filename, cb) {
  request.get(url)
  .on('end', () => {
    if (typeof cb === 'function') {
      cb();
    }
  })
  .pipe(fs.createWriteStream(filename));
}

// Main
const version = process.env.npm_package_version;
const platform = process.env.npm_package_config_platform;

getAppInfo((data) => {
  if (data.version !== version) {
    console.warn('Warning: The version on PGB does not match current npm package version.');
  }
  // console.dir(data);
  const url = `${pgbBaseUrl}/apps/${pgbAppId}/${platform}?access_token=${pgbToken}`;
  const fileExtension = (platform === 'ios') ? 'ipa' : 'apk';
  const filename = `builds/${platform}-dev-v${data.version}-b${data.build_count}.${fileExtension}`;
  downloadFile(url, filename, () => {
    console.log(`App downloaded to ${filename}`);
    console.log('To install scan the QR code below:');
    qrcode.generate(data.install_url);
  });
});
