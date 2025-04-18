#!/usr/bin/env node

// youtube-segments.js
// job  : given timestamps, calculate the duration of segments


'use strict'

console.log(youtube_timestamps(process.argv.slice(2));

// Returns a JSON representation of time segments for valid timestamps
function youtube_timestamps(str) {

  // this is the timestamps array
  // the total number of valid timestamps are
  // space-delimited time
  const ts = str.split(/\s/)
    .map(mmss_to_microseconds)
    .filter((a)=>!!a);

  const dt = ts.map(time_segments)
    .filter((a)=>!!a);

  const dtu = dt.map((a)=>a*1000);

  const dth = dt.map(seconds_to_mmss);

  const arr = [
    [ 'input-str-mmss', str ],
    [ 'timestamps-ts-microseconds',  ts ],
    [ 'segments-dt-seconds', dt],
    [ 'segments-dtu-microseconds', dtu],
    [ 'segments-dth-mmss', dth],
  ];

  return JSON.stringify(arr, 1, ' ');
}


// Returns time duration in MM:SS format, given a valid number
// Otherwise, returns false
function seconds_to_mmss(num) {

  if(!isNumber(num)) {
    return false;
  }

  num = Math.round(num);

  let mm = Math.floor(num / 60);
  let ss = '' + Math.floor(num % 60);
  ss = ss.padStart(2,0);

  return `${mm}:${ss}`;
}


// Returns the total number of seconds, given a valid mm:ss timestamp.
// Otherwise, returns false.
function mmss_to_seconds(str) {

  const re = /(^\d{1,2}):([012345]\d)$/;
  const arr = str.match(re);

  // debug: the match array
  // console.log('match array: %o', arr);

  if(arr) {
    const mm = Number(arr[1]);
    const ss = Number(arr[2]);
    return mm * 60 + ss;
  }

  return false;
}


// Returns the total number of microseconds, given a valid mm:ss timestamp.
// Otherwise, returns false.
function mmss_to_microseconds(str) {

  const seconds = mmss_to_seconds(str);

  if(isNumber(seconds)) {
    return seconds * 1000;
  }

  return false;
}


// Returns length of time segments for non-negative numbers
// Otherwise, returns false
function time_segments(str, i, arr) {

  if(i > 0 ) {
    const diff = arr[i] - arr[i-1];
    return diff / 1000;
  }

  return false;
}


// Returns true, if the input type is number
// Otherwise, returns false
function isNumber(num) {
  return typeof num === 'number';
}
