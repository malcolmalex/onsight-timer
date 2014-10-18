var Rx = require('./components/rxjs/dist/rx.lite.js');
var numeral = require('./components/numeraljs/numeral.js');

// Declare transition and climb time in seconds
//TODO: Save these to local storage eventually
var t_total_sec;
var c_total_sec;

// Declare timers
// TODO: Horrible organization here with so much global state
var mainTimer;
var transitionTimer;
var climbTimer;

// Declare subscriptions that will be udpated in various event handlers
var mainSubscription;
var transitionSubscription;
var climbSubscription;

// Setup audio files for notifying climbers of important times
var BEGIN_CLIMBING = new Audio("audio/begin_climbing_edited.mp3");
var BEGIN_TRANSITION = new Audio("audio/begin_transition_edited.mp3");
var ONE_MINUTE = new Audio("audio/one_minute_edited.mp3");
var TEN_SECONDS = new Audio("audio/ten_seconds_edited.mp3");
var TIME_TIME = new Audio("audio/time_time_edited.mp3");

function createTimers() {
  // Create transition and climb streams with events 1000 ms apart, but
  // keep only transition time and climb time worth
  // Get the countdown by subtracting the seconds from the stream total
  transitionTimer = Rx.Observable.timer(1000,1000)
        .take(t_total_sec)
        .map( function (x) {
          return (t_total_sec - x);
        });

  climbTimer = Rx.Observable.timer(1000,1000)
        .take(c_total_sec)
        .map( function (x) {
          return (c_total_sec - x);
        });

  // Concatenate the streams together, and repeat. This enables each to be
  // treated independently, yet put together and repeated with easily
  // understood behavior.
  mainTimer = Rx.Observable.concat(transitionTimer, climbTimer).repeat();
}

// Open settings window
// function toggleDialog(transition) {
//   $('paper-dialog[transition=' + transition + ']').toggle();
// }
function toggleDialog(transition) {
  var dialog = document.querySelector('paper-dialog[transition=' + transition + ']');
  dialog.toggle();
}


// Save transition and climb times in seconds. UI provides times as "00:00"
// format
function save() {
  var t_min = parseInt($('#t_time').val().substring(0,2));
  var t_sec = parseInt($('#t_time').val().substring(3));

  var c_min = parseInt($('#c_time').val().substring(0,2));
  var c_sec = parseInt($('#c_time').val().substring(3));

  // Calculate transition time and climb time from minutes and seconds
  t_total_sec = t_min * 60 + t_sec;
  c_total_sec = c_min * 60 + c_sec;

  createTimers();
}

// Add event handlers
$('#play').on('click', function() {
  console.log("started timer");

  // start/subscribe to the main event stream
  mainSubscription = mainTimer.subscribe(
    function (x) {
      var timeString = numeral(x).format('0:00:00').substr(2);
      $('#time').text(timeString);
      //console.log('Next: ' + numeral(x).format('0:00:00').substr(2));
    },
    function (err) {
      console.log('Error: ' + err);
    },
    function () {
      console.log('Completed');
    }
  );
});

$('#stop').on('click', function() {
  console.log("stoped timer");
  mainSubscription.dispose();
});
