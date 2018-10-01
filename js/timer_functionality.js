$(document).ready(function() {
  // Constants
  var start = null;
  var end = null;
  var intervals = [];

  // console.log(all_projects);
  // console.log(account_name);
  // console.log(profile);

  var company_db = account_name.replace(/[^A-Z0-9]+/ig, "_").toLowerCase();
  var db = new PouchDB("https://e8f911a8-d248-4368-a746-cebad35bb583-bluemix:8ed78811bfba110ac8fe4a5f5bf339ca98291f864d695a2daee5b9f1da96fe83@e8f911a8-d248-4368-a746-cebad35bb583-bluemix.cloudant.com/" + company_db);

  // Populate Job Codes
  $.each(job_codes, function() {
    var group = '<optgroup label="' + this.first_code + ' - ' + this.title + '">';
    $(".timer_log .job_code").append(group);

    var first_code = this.first_code;
    $.each(this.last_code, function(key, val) {
      var option = '<option value="' + first_code + key + '">' + first_code + key + ' - ' + val + '</option>';
      $(".timer_log .job_code").append(option);
    });
  });

  // Populate Projects
  $.each(all_projects, function() {
    var option = '<option value="' + this.name + '">' + this.name + '</option>';
    $(".timer_log .project").append(option);
  });


  var anim = anime({
    targets: '.count .counter',
    width: [
      {value: '25%', easing:'easeInCubic'},
      {value: '0%', easing: 'easeOutCubic'},
    ],
    left: [
      {value: '75%', easing: 'easeInCubic'},
      {value: '100%', easing:'easeOutCubic'},
    ],
    duration: 2000,
    loop: true,
    autoplay:false
  });

  // Start Timer
  $(document).on("click", ".start_timer", function() {
    if (start == null) {
      var time = new Date();
      start = time.getTime();
      var hour = (time.getHours() > 12) ? (time.getHours() - 12) : time.getHours();
      var minute = (time.getMinutes() < 10) ? ('0' + time.getMinutes()) : time.getMinutes();
      var meridiem = (time.getHours() >= 12) ? 'pm' : 'am';

      $(".start").text(hour + ':' + minute + meridiem);

      $(".start_timer").hide();
      $(".stop_timer").show();
      $(".pause_timer").show();

      anim.play();
    }
  });

  // Pause Timer
  $(document).on("click", ".pause_timer", function() {
    var time = new Date();
    end = time.getTime();

    intervals.push({'end': end, 'start': start});
    start = null;
    end = null;

    $(".pause_timer").hide();
    $(".resume_timer").show();
    anim.pause();
  });

  // Resume Timer
  $(document).on("click", ".resume_timer", function() {
    var time = new Date();
    start = time.getTime();

    $(".pause_timer").show();
    $(".resume_timer").hide();
    anim.play();
  });

  // Stop Timer
  $(document).on("click", ".stop_timer", function() {
    if (end == null) {
      var time = new Date();
      end = time.getTime();
      var hour = (time.getHours() > 12) ? (time.getHours() - 12) : time.getHours();
      var minute = (time.getMinutes() < 10) ? ('0' + time.getMinutes()) : time.getMinutes();
      var meridiem = (time.getHours() >= 12) ? 'pm' : 'am';

      $(".end").text(hour + ':' + minute + meridiem);

      intervals.push({'end': end, 'start': start});

      console.log(intervals);

      var total_time = 0;
      $.each(intervals, function(key, val) {
        var dif = this.end - this.start;
        total_time = total_time + dif;
      });

      var total_time = parseFloat((total_time / 1000) / 3600).toFixed(2);

      $(".timer .submission").show();
      $(".timer .stop_timer").hide();
      $(".timer .done_timer").show();
      $(".timer .pause_timer").hide();
      $(".timer .resume_timer").hide();

      $(".timer_log .date").val(time.toISOString());
      $(".timer_log .datestring").val(time.getMonth() + 1 + '/' + time.getDate());
      $(".timer_log .hours").val(total_time);

      anim.seek(anim.duration);
      anim.pause();
    }
  });

  // Reset Timer
  var reset_timer = function reset_timer(message) {
    if (confirm(message)) {
      start = null;
      end = null;
      intervals = [];

      $(".start").text('Start');
      $(".end").text('End');
      $(".timer .submission").hide();
      $(".timer .stop_timer").hide();
      $(".timer .done_timer").hide();
      $(".timer .start_timer").show();
      $(".timer .pause_timer").hide();
      $(".timer .resume_timer").hide();
    } else {
      return;
    }
  }
  $(document).on("click", ".reset_timer", function() {
    reset_timer("Are you sure you'd like to reset the timer?")
  });

  // Submit Log
  $(document).on("click", ".submit_timer", function() {
    var id = new Date().toJSON() + 0;
    var user_id = profile.id;
    var user_name = profile.name;
    var date = $(".timer_log .date").val();
    var hours = $(".timer_log .hours").val();
    var job_code = ($(".timer_log .job_code").val() == null) ? job_code = '' : $(".timer_log .job_code").val();
    var description = $(".timer_log .description").val();
    var project = $(".timer_log .project").val();

    if (hours > 0 && project) {
      var log = {
        '_id': id,
        'user_id': user_id,
        'user_name': user_name,
        'date': date,
        'hours': hours,
        'job_code': job_code,
        'description': description,
        'project': project
      }
      db.put(log);
      reset_timer("Are you sure you'd like to submit this log?");
    } else {
      M.toast({html: 'No Hours'});
    }
  });


});
