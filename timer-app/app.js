var timer = new Tock({
  countdown: true,
  interval: 10,
  callback: function() {
    var current_time = timer.msToTime(timer.lap());
    $('#time').text(current_time.substring(0,5));
  },
  complete: function() {
    $('#time').text("00:00");
  }
});

$('#play').on('click', function() {
  var start_time = timer.timeToMS("01:00");
  timer.start(start_time);
});

$('#stop').on('click', function() {
  timer.stop();
});

$('#pause').on('click', function() {
  timer.pause();
});

function toggleDialog(transition) {
  var dialog = document.querySelector('paper-dialog[transition=' + transition + ']');
  dialog.toggle();
}
