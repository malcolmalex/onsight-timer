var Rx = require('./components/rxjs/dist/rx.lite.js');
var numeral = require('./components/numeraljs/numeral.js');

// Declare transition and climb time in seconds
//TODO: Save these to local storage eventually
var t_total_sec;
var c_total_sec;

// Declare streams (Observables)
// TODO: Horrible organization here with so much global state
var mainStream;
var transitionStream;
var climbStream;
var transitionActionsStream;
var veryFirstElement;

// Declare subscriptions that will be udpated in various event handlers
var mainSubscription;
var transitionSubscription;
var climbSubscription;

// Setup audio files for notifying climbers of important times
var BEGIN_CLIMBING = new Audio("audio/begin_climbing_edited.mp3");
var BEGIN_TRANSITION = new Audio("audio/begin_transition_edited.mp3");
var ONE_MINUTE = new Audio("audio/one_minute_edited.mp3");
var TEN_SECONDS = new Audio("audio/ten_seconds_edited.mp3");
var TIME_TIME_CLIMB = new Audio("audio/time_time_climb_edited.mp3");
var TIME_TIME_TRANSITION = new Audio("audio/time_time_transition_edited.mp3");

function createStreams() {
  // Create transition and climb streams with events 1000 ms apart, but
  // keep only transition time and climb time worth
  // Get the countdown by subtracting the seconds from the stream total
  // Uses total_sec + 1 to get a beginning event and ending event.
  var numTransitionEvents = t_total_sec != 0 ? t_total_sec + 1 : 0
  transitionStream = Rx.Observable.timer(0,1000)
        .take(numTransitionEvents)
        .map( function (x) {
          return ["TRANSITION", (t_total_sec - x)]; // maybe rewrite as a .zip
        });

  var numClimbEvents = c_total_sec + 1
  climbStream = Rx.Observable.timer(0,1000)
        .take(numClimbEvents)
        .map( function (x) {
          return ["CLIMB", (c_total_sec - x)]; // maybe rewrite as a .zip
        });

  // Concatenate the streams together, and repeat. This enables each to be
  // treated independently, yet put together and repeated with easily
  // understood behavior.
  mainStream = Rx.Observable.concat(transitionStream, climbStream).repeat();

  veryFirstEvent = mainStream.take(1);

  transitionActionsStream = mainStream.filter(
    function (x) {
      if (x[0] === "TRANSITION" && x[1] === t_total_sec) return x;
    }
  );

  // Delay for a few ms to allow end-climbing or end-transition to complete
  climbingBeginActionStream = mainStream.filter(
    function (x) {
      if (x[0] === "CLIMB" && x[1] === c_total_sec) return x;
    }
  );

  oneMinuteWarningStream = mainStream.filter(
    function (x) {
      if (x[0] === "CLIMB" && x[1] === 60) return x;
    }
  );

  tenSecondWarningStream = mainStream.filter(
    function (x) {
      if (x[0] === "CLIMB" && x[1] === 10) return x;
    }
  );

  endClimbingStream = mainStream.filter(
    function (x) {
      if (x[0] === "CLIMB" && x[1] == 0) return x;
    }
  );
}

function createSubscriptions() {

  // At very beginning, if there is no transition time, play audio for
  // begin climbing, else play audio for begin transition
  veryFirstSubscription = veryFirstEvent.subscribe(
    function (x) {
      if (t_total_sec === 0) {
        BEGIN_CLIMBING.play();
      } else {
        BEGIN_TRANSITION.play();
      }
    }
  );

  // Change time color and show "transition" under time. No need to play
  // begin transition track here because it is tacked on to either the
  // end-of-climbing or end-of-transition
  transitionSubscription = transitionActionsStream.subscribe(
    function (x) {
      $('#time').removeClass().addClass('transition');
      $('#tagline').text("Transition");
    },
    function (err) {},
    function () {}
  );

  // If there is a transition, play begin climbing track, otherwise play
  // nothing and just update time color to black and remove "transition"
  // tagline
  climbingBeginSubscription = climbingBeginActionStream.subscribe(
    function (x) {
      console.log('Begin climbing (sec) - ' + (performance.now()/1000));
      if (t_total_sec != 0) {
        BEGIN_CLIMBING.play();
      }
      $('#time').removeClass().addClass('climb');
      $('#tagline').text("");
    },
    function (err) {},
    function () {}
  );

  // Change time to red and play one minute warning
  oneMinuteWarningSubscription = oneMinuteWarningStream.subscribe(
    function (x) {
      ONE_MINUTE.play();
      $('#time').removeClass().addClass('warning');
    },
    function (err) {},
    function () {}
  );

  // Change time to red and play 10 second warning
  tenSecondWarningSubscription = tenSecondWarningStream.subscribe(
    function (x) {
      TEN_SECONDS.play();
      $('#time').removeClass().addClass('warning');
    },
    function (err) {},
    function () {}
  );

  // Call time at end of climbing, and tell people to transition
  // or climb, as appropriate
  endClimbingSubscription = endClimbingStream.subscribe(
    function (x) {
      console.log('  End climbing (sec) - ' + (performance.now()/1000));
      if (t_total_sec === 0) {
        TIME_TIME_CLIMB.play();
      } else {
        TIME_TIME_TRANSITION.play();
      }
    },
    function (err) {},
    function () {}
  );

  // start/subscribe to the main event stream
  mainSubscription = mainStream.subscribe(
    function (x) {
      var timeString = numeral(x[1]).format('0:00:00').substr(2);
      $('#time').text(timeString);
    },
    function (err) {},
    function () {}
  );
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

  createStreams();
}

// Add event handlers
$('#play').on('click', function() {
  // TODO: add error toast for click play with no settings.
  console.log("Timer START");
  createSubscriptions();

});

$('#stop').on('click', function() {
  console.log("Timer STOP");
  mainSubscription.dispose();
  transitionSubscription.dispose();
  climbingBeginSubscription.dispose();
  oneMinuteWarningSubscription.dispose();
  tenSecondWarningSubscription.dispose();
  endClimbingSubscription.dispose();
});
