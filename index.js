var schedule = require('./games');

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

// return game status 'outdated' and 'game over' (+2h from start)
function gameStatus(diffMs) {
  var TWO_HOURS = -7200001;
  var outdated = diffMs <= 0 ;
  var gameOver = diffMs <= TWO_HOURS;
  return { outdated: outdated, gameOver: gameOver }
}

// return diff from current to deadline
function getDiff(time){
  var exp = new Date('2018-06-27 19:01:00');
  var now = new Date(exp.getFullYear(), exp.getMonth(), exp.getDate(), exp.getHours(), exp.getMinutes(), 0).valueOf();
  var target = new Date(time).valueOf();
  return  target - now;
}

// return object find relevant
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

// find object relevant game
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
