(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
beep = require('browser-beep')({ frequency: 830 })
},{"browser-beep":2}],2:[function(require,module,exports){
var FREQUENCY = 440
var INTERVAL = 250
var RAMP_VALUE = 0.00001
var RAMP_DURATION = 1

module.exports = function (options) {
  if (!options) options = {}
  window.AudioContext = window.AudioContext || window.webkitAudioContext
  var context = options.context || new window.AudioContext()
  var frequency = options.frequency || FREQUENCY
  var interval = options.interval || INTERVAL

  var play = function () {
    var currentTime = context.currentTime
    var osc = context.createOscillator()
    var gain = context.createGain()

    osc.connect(gain)
    gain.connect(context.destination)

    gain.gain.setValueAtTime(gain.gain.value, currentTime)
    gain.gain.exponentialRampToValueAtTime(RAMP_VALUE, currentTime + RAMP_DURATION)

    osc.onended = function () {
      gain.disconnect(context.destination)
      osc.disconnect(gain)
    }

    osc.type = 'sine'
    osc.frequency.value = frequency
    osc.start(currentTime)
    osc.stop(currentTime + RAMP_DURATION)
  }

  var beep = function (times) {
    if (!times) times = 1

    ;(function loop (i) {
      play()
      if (++i < times) setTimeout(loop, interval, i)
    })(0)
  }

  beep.destroy = function () {
    if (!options.context) context.close()
  }

  return beep
}

},{}]},{},[1]);
