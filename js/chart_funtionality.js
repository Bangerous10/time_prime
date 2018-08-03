$(document).ready(function() {

  var db = new PouchDB("https://e8f911a8-d248-4368-a746-cebad35bb583-bluemix:8ed78811bfba110ac8fe4a5f5bf339ca98291f864d695a2daee5b9f1da96fe83@e8f911a8-d248-4368-a746-cebad35bb583-bluemix.cloudant.com/" + localStorage.getItem('company_db'));
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var project = localStorage.getItem("project");
  var users = {};
  var dates = {};
  var colors = [];

  $(".project").html(project);


  db.createIndex({
    index: {
      fields: ['date', 'project'],
    }
  }).then(function (result) {
    return db.find({
      selector: {
        project: project,
        date: {$gt: null},
      },
      sort: [{date: 'asc'}],
    })
  }).then(function(docs) {
    $.each(docs.docs, function(i) { // Defines values as integers
      users[this.user_name] = 0;

      var date = new Date(this.date);
      var date_format = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
      dates[date_format] = 0;
    });

    $.each(docs.docs, function(i) {
      users[this.user_name] += parseFloat(this.hours);

      var date = new Date(this.date);
      var date_format = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
      dates[date_format] += parseFloat(this.hours);
    });

    // Generate Random Colors
    for(i=0; i<Object.keys(users).length; i++) {
      colors.push('#'+ ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6));
    }

    // Sum Total Hours
    var total_hours = Object.values(users).reduce(function(acc, val) { return acc + val; });
    $(".total_hours").html(total_hours.toFixed(2));

    // Pie Chart
    var pie = $("#pie-chart");
    var myChart = new Chart(pie, {
      type: 'doughnut',
      data: {
        labels: Object.keys(users),
        datasets: [{
          label: 'Contributor',
          data: Object.values(users),
          backgroundColor: colors,
          borderColor: 'white',
          borderWidth: 1,
        }]
      }
    });

    // Line Chart
    var line = $("#line-chart");
    var myChart = new Chart(line, {
      type: 'line',
      data: {
        labels: Object.keys(dates),
        datasets: [{
          label: 'Hours Contributed',
          data: Object.values(dates),
          lineTension: 0,
          pointBackgroundColor: 'rgb(238, 53, 36)',
          backgroundColor: 'rgba(0,0,0,0)',
          borderColor: 'rgb(238, 53, 36)',
          borderWidth: 3
        }]
      },
      options: {
        legend: {
          display:false,
        },
        scales: {
          yAxes: [{
            gridLines: {
              display:false
            },
            ticks: {
              min: 0
            }
          }]
        }
      }
    });

  }).catch(function (err) {
    console.log(err);
  });

$("canvas").height("200px").width("200px").css("display", "inline-block");



});
