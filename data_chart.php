<?php
require('authorize.php');
require('header.html');
?>
<script src="js/chart_funtionality.js"></script>



<div class="charts">
  <a href="index.php?url=<?php echo $url . '&account_name=' . $account_name ?>" class="back">
    <i class="fas fa-chevron-left"></i>
    <h3 class="title project"></h3>
  </a>


  <div class="row">
    <div class="max-width charts_row_container">
      <div class="info col s12 m6">
        <p>
          Here is a collection of the hours users contributed to <span class="project"></span>. This is all-time contributions,
          not specific to any timeframe. In total, users have contributed <span class="total_hours"></span> hours to this job.
        </p>
      </div>
      <div class="chart col s12 m6">
        <canvas id="pie-chart"></canvas>
      </div>

    </div>
  </div>

  <div class="row">
    <div class="max-width charts_row_container">
      <div class="chart col s12 m6">
        <canvas id="line-chart"></canvas>
      </div>
      <div class="info col s12 m6">
        <p>
          This line graph displays the activity on <span class="project"></span>. The timeframe spans from the first
          entry to the last entry.
        </p>
      </div>
    </div>
  </div>

</div>



<?php require('footer.html'); ?>
