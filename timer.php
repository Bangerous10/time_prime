<?php
  require('authorize.php');
  require('header.html');

  // Get All Projects
  for ($x = 1; $x <= 5; $x++) {
    $client->CallAPI(
      "{$url}/projects.json?page=$x",
      'GET', array(), array('FailOnAccessError'=>true), $active_project);
    foreach($active_project as $active_project) {
      $projects[$active_project->name] = $active_project;
    }
  }

  for ($x = 1; $x <= 5; $x++) {
    $client->CallAPI(
      "{$url}/projects.json?status=archived&page=$x",
      'GET', array(), array('FailOnAccessError'=>true), $archived_project);
    foreach($archived_project as $archived_project) {
      $projects[$archived_project->name] = $archived_project;
    }
  }

  ksort($projects);
  $projects = json_encode($projects);


  $client->CallAPI(
    "{$url}/my/profile.json",
    'GET', array(), array('FailOnAccessError'=>true), $profile);
    $profile = json_encode($profile);
?>
<script>
<?php
  echo "var all_projects = " . $projects . ";";
  echo "var profile = " . $profile . ";";
  echo "var account_name = '" . $account_name . "';";
?>
</script>
<script src="js/timer_functionality.js"></script>
<body style="background-color:#f0f0f0;">
  <main class="timer">
    <a href="index.php" ><i class="fas fa-chevron-left"></i> Return</a>
    <a href="#!" class="pause_timer" ><i class="fas fa-pause"></i> Pause</a>
    <a href="#!" class="resume_timer" ><i class="fas fa-play"></i> Resume</a>
    <div class="count">
      <span class="start">Start</span>
      <i class="far fa-play-circle start_timer"></i>
      <i class="far fa-stop-circle stop_timer"></i>
      <i class="far fa-check-circle done_timer blue-text"></i>
      <span class="end">Finish</span>
      <div class="counter"></div>
    </div>
    <div class="submission">
      <div class="row timer_log">
        <input type="hidden" class="date" value="" />
        <div class="input-field col s12 m2 inline">
          <input type="text" class="datestring" disabled value="" />
        </div>
        <div class="input-field col s12 m10">
          <select class="project browser-default">
            <option value="" disabled selected>Project</option>
          </select>
        </div>
        <div class="input-field col s12">
          <select class="job_code browser-default">
            <option value="" disabled selected>Job Code</option>
          </select>
        </div>
        <div class="input-field col s12">
          <textarea class="materialize-textarea description" placeholder="Description"></textarea>
        </div>
        <div class="input-field col s12">
          <input type="number" class="hours" value="" />
        </div>
      </div>
      <button class="btn-flat waves-effect submit_timer">Submit</button>
      <button class="btn-flat waves-effect reset_timer">Reset</button>
    </div>

  </main>
</body>

</html>
