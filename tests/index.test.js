var schedule = require('../games');

var compose = function compose() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (x) {
    return fns.reduceRight(function (acc, fn) {
      return fn(acc);
    }, x);
  };
};

function gameStatus(diffMs) {
  var TWO_HOURS = -7200001;
  var outdated = diffMs <= 0 ;
  var gameOver = diffMs <= TWO_HOURS;
  return { outdated: outdated, gameOver: gameOver }
}

var TEST_CURRENT_TIME = '2018-06-14 15:00:00';

function getDiff(time){
  var exp = new Date(TEST_CURRENT_TIME); //?
  var now = new Date(exp.getFullYear(), exp.getMonth(), exp.getDate(), exp.getHours(), exp.getMinutes(), 0).valueOf();
  var target = new Date(time).valueOf();
  return  target - now;
}

function timeObject(diffMs) {
  var day, hour, minute, seconds;
  seconds = Math.floor(diffMs / 1000);
  minute = Math.floor(seconds / 60);
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  day = Math.floor(hour / 24);
  hour = hour % 24;
  var status = gameStatus(diffMs);
  return { day: day, hour: hour, minute: minute, outdated: status.outdated, gameOver: status.gameOver };
}

function findGame( gamesList ){
  var statusCompose = compose(gameStatus, getDiff);

  for(var i = 0; i <= gamesList.length - 1; i++){
    var status = statusCompose(gamesList[i].time);
    if ( !status.outdated && !status.gameOver || status.outdated && !status.gameOver  ) {
      return gamesList[i]
    } else if ( i === gamesList.length - 1 ) {
      return gamesList[gamesList.length - 1]
    }
  }
}

var game = findGame( schedule );                        //?. $
var resObj = compose(timeObject, getDiff)( game.time ); //?. $



test('Russia v Saudi Arabia', () => {
  TEST_CURRENT_TIME = '2018-06-14 20:00:00';
  expect( findGame( schedule ) ).toEqual({ group:'Russia v Saudi Arabia',  time: '2018-06-14 15:00:00 UTC',  id: 100,  left: 'Russia',  right: 'Saudi Arabia' })
})



test('Serbia v Brazil 19:01', () => {
  TEST_CURRENT_TIME = '2018-06-27 19:01:00';
  expect( findGame( schedule ) ).toEqual({
    group:'Serbia v Brazil',
    time: '2018-06-27 18:00:00 UTC',
    id: 116,
    left: 'Serbia',
    right: 'Brazil'
  })
})


test('Belgium v Tunisia 17:00', () => {
  TEST_CURRENT_TIME = '2018-06-23 17:00:00';
  expect( findGame( schedule ) ).toEqual({
    group:'Belgium v Tunisia',
    time: '2018-06-23 12:00:00 UTC',
    id: 110,
    left: 'Belgium',
    right: 'Tunisia'
  })
})

test('Belgium v Tunisia ---> Germany v Sweden 17:01', () => {
  TEST_CURRENT_TIME = '2018-06-23 17:01:00';
  expect( findGame( schedule ) ).toEqual({
    group:'Germany v Sweden',
    time: '2018-06-23 18:00:00 UTC',
    id: 111,
    left: 'Germany',
    right: 'Sweden'
  })
})

test('Serbia v Brazil 23:00', () => {
  TEST_CURRENT_TIME = '2018-06-27 23:00:00';
  expect( findGame( schedule ) ).toEqual({
    group:'Serbia v Brazil',
    time: '2018-06-27 18:00:00 UTC',
    id: 116,
    left: 'Serbia',
    right: 'Brazil'
  })
})

test('Japan v Poland 23:01', () => {
  TEST_CURRENT_TIME = '2018-06-27 23:01:00';
  expect( findGame( schedule ) ).toEqual({
    group:'Japan v Poland',
    time: '2018-06-28 14:00:00 UTC',
    id: 117,
    left: 'Japan',
    right: 'Poland'
  })
})

test('last game 2018-06-28 19:01:00', () => {
  TEST_CURRENT_TIME = '2018-06-28 19:01:00';
  expect( findGame( schedule ) ).not.toBeUndefined();
})

test('current time', () => {
  TEST_CURRENT_TIME = new Date();
  expect( findGame( schedule ) ).toEqual({ group:'Russia v Saudi Arabia',  time: '2018-06-14 15:00:00 UTC',  id: 100,  left: 'Russia',  right: 'Saudi Arabia' })
})