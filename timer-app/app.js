//TODO: Save these to local storage eventually
var Rx = require('./components/rxjs/dist/rx.lite.js');
var numeral = require('./components/numeraljs/numeral.js');

// Default transition and climb times (in seconds) for test
var t_min = 3;
var t_sec = 30;
var c_min = 4;
var c_sec = 0;

// Calculate transition time and climb time from minutes and seconds
var t_total_sec = t_min * 60 + t_sec;
var c_total_sec = c_min * 60 + c_sec;

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

// Create transition and climb streams with events 1000 ms apart, but
// keep only transition time and climb time worth
// Get the countdown by subtracting the seconds from the stream total
var transitionTimer = Rx.Observable.timer(1000,1000)
      .take(t_total_sec)
      .map( function (x) {
        return (t_total_sec - x);
      });

var climbTimer = Rx.Observable.timer(1000,1000)
      .take(c_total_sec)
      .map( function (x) {
        return (c_total_sec - x);
      });

// Concatenate the streams together, and repeat. This enables each to be
// treated independently, yet put together and repeated with easily
// understood behavior.
var mainTimer = Rx.Observable.concat(transitionTimer, climbTimer).repeat();

// Open settings window
function toggleDialog(transition) {
  $('#paper-dialog[transition=' + transition + ']').toggle();
}

// Save transition and climb times in minutes and seconds
function save() {
  t_min = $('#t_min').val();
  t_sec = $('#t_sec').val();
  c_min = $('#c_min').val();
  c_sec = $('#c_sec').val();
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
