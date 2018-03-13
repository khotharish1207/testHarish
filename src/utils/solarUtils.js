// Sunrise and sunset calculator
// Reference http://williams.best.vwh.net/sunrise_sunset_algorithm.htm

// Helpers
const deg2rad = Math.PI / 180;

function sin(deg) {
  return Math.sin(deg2rad * deg);
}

function asin(ratio) {
  return Math.asin(ratio) / deg2rad;
}

function cos(deg) {
  return Math.cos(deg2rad * deg);
}

function acos(ratio) {
  return Math.acos(ratio) / deg2rad;
}

function tan(deg) {
  return Math.tan(deg2rad * deg);
}

function atan(ratio) {
  return Math.atan(ratio) / deg2rad;
}

function within(x, period) {
  let result = x;
  while (result < 0) {
    result += period;
  }
  while (result >= period) {
    result -= period;
  }
  return result;
}

function calculate(year, month, day, lat, lng, UTCoffset, sunrise) {
  // 1 - Day of the year
  const N1 = Math.floor((275 * month) / 9);
  const N2 = Math.floor((month + 9) / 12);
  const N3 = 1 + Math.floor((year - (4 * Math.floor(year / 4 )) + 2) / 3);
  const doy = N1 - (N2 * N3) + day - 30;

  // 2 - Approx time
  const lngHour = lng / 15;
  let approxTime = 0;
  if (sunrise) {
    approxTime = doy + ((6 - lngHour) / 24);
  } else {
    approxTime = doy + ((18 - lngHour) / 24);
  }

  // 3 - Mean Anomaly
  const meanAnomaly = (0.9856 * approxTime) - 3.289;

  // 4 - True Longitude
  let trueLng = meanAnomaly + (1.916 * sin(meanAnomaly)) + (0.020 * sin(2 * meanAnomaly)) + 282.634;
  trueLng = within(trueLng, 360);

  // 5 - Right ascension
  let rightAscension = within(atan(0.91764 * tan(trueLng)), 360);
  const LQuad = Math.floor(trueLng / 90) * 90;
  const RAQuad = Math.floor(rightAscension / 90) * 90;
  rightAscension = (rightAscension + (LQuad - RAQuad)) / 15;

  // 6 through 8 - local hour angle
  const sinDec = 0.39782 * sin(trueLng);
  const cosDec = cos(asin(sinDec));
  const cosH = (-sinDec * sin(lat)) / (cosDec * cos(lat));

  if (cosH > 1 || cosH < -1) {
    // this only happens in the artic / antartic circles
    return NaN;
  }

  let localHourAngle = 0;
  if (sunrise) {
    localHourAngle = 360 - acos(cosH);
  } else {
    localHourAngle = acos(cosH);
  }

  localHourAngle /= 15;

  // Result
  const time = localHourAngle + rightAscension - (0.06571 * approxTime) - 6.622;

  if (UTCoffset) {
    return within(time - lngHour + UTCoffset, 24);
  }
  return within(time - lngHour, 24);
}

function calculateSunrise(year, month, day, lat, lng, UTCoffset) {
  return calculate(year, month, day, lat, lng, UTCoffset, true);
}

function calculateSunset(year, month, day, lat, lng, UTCoffset) {
  return calculate(year, month, day, lat, lng, UTCoffset, false);
}

export { calculateSunrise, calculateSunset };

// Quick Test
// const year = 2016;
// const month = 11;
// const day = 28;
// const lat = 45.502177;
// const lng = -73.567085;
// const UTCoffset = -5;

// console.log('sunrise', calculate(year, month, day, lat, lng, UTCoffset, true));
// console.log('sunset', calculate(year, month, day, lat, lng, UTCoffset, false));
