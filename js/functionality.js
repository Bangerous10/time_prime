$(document).ready(function() {

  // Log Gathered Basecamp Data ============================================================================
  // console.log(all_users);
  // console.log(profile);
  // console.log(all_projects);
  // console.log(job_codes);

  // Initializations =======================================================================================
  function initMaterialize() {
    $('.modal').modal({
      startingTop: '0%',
      endingTop: '5%',
    });
    $('.datepicker').datepicker({
      showDaysInNextAndPreviousMonths: true,
      maxDate: new Date(),
    });
    $('select').formSelect();
  }
  initMaterialize();

  var company_name = profile.company.name;
  var company_id = profile.company.id;
  var company_db = company_name.replace(/[^A-Z0-9]+/ig, "_").toLowerCase();
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var current_logs = [];

  var db = new PouchDB("https://e8f911a8-d248-4368-a746-cebad35bb583-bluemix:8ed78811bfba110ac8fe4a5f5bf339ca98291f864d695a2daee5b9f1da96fe83@e8f911a8-d248-4368-a746-cebad35bb583-bluemix.cloudant.com/" + company_db);

  // Display User Info =====================================================================================
  $(".user_image").css("background-image", "url(" + profile.avatar_url + ")");
  $(".user_name").html(profile.name);
  $(".user_company").html(company_name);

  // Display & Populate Projects ===========================================================================
  $.each(all_projects, function(i) {
    all_projects[i].name = all_projects[i].name.replace(/['"]+/g, '');
    var create_date = new Date(this.created_at);
    $(".projects .project_list").append('<div class="project grid"><h6 class="name truncate">' + this.name + '</h6><p>Created: ' + months[create_date.getMonth()] + '/' + create_date.getDate() + '/' + create_date.getFullYear() + '</p></div>');
    $(".projects .project_list .project:last-child").append('<div class="icon"><i class="fas fa-archive"></i><i class="fas fa-thumbtack"></i></div>');

    if (this.status == 'archived') {
      $(".projects .project_list .project:last-child").addClass('archived');
    } else if (this.bookmarked == true) {
      $(".projects .project_list .project:last-child").addClass('bookmarked active');
    } else {
      $(".projects .project_list .project:last-child").addClass('active');
    }

    $(".project.bookmarked").insertAfter(".projects .project_list .input-field");

    var option = '<option value="' + this.name + '">' + this.name + '</option>';
    $(".add_log .project").append(option);
    $("#report_modal #report_project").append(option);
  });

  // Show/Hide Project Lists and Format
  $(".toggle").click(function(e) {
    $(this).toggleClass('active');

    if ($(this).hasClass("archive_toggle")) {
      $("#search_projects").val('');
      $("label[for='search_projects']").removeClass('active');
      if ($(this).hasClass('active')) {
        $(".project.archived").show();
        $(".project.active").hide();
      } else {
        $(".project.archived").hide();
        $(".project.active").show();
      }
    } else if ($(this).hasClass("grid_toggle")) {
      $(".projects .project").toggleClass("grid");
    }
  });

  // Search Projects
  $(".projects .search").keyup(function() {
    var d = $(this).val().toLowerCase();
    var archive_search = ($(".projects .archive_toggle").hasClass("active")) ? true : false;

    var filter_projects = function filter_projects() {
      var name = $(this).find(".name").text().toLowerCase();
      if (name.includes(d)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    }

    if (archive_search == false) {
      $(".projects .project.active").each(filter_projects);
    } else if (archive_search == true ) {
      $(".projects .project.archived").each(filter_projects);
    }

  });

  // Populate Job Codes ====================================================================================
  $.each(job_codes, function() {
    var group = '<optgroup label="' + this.first_code + ' - ' + this.title + '">';
    $(".add_log .job_code").append(group);
    $("#edit_modal #edit_job_code").append(group);

    var first_code = this.first_code;
    $.each(this.last_code, function(key, val) {
      var option = '<option value="' + first_code + key + '">' + first_code + key + ' - ' + val + '</option>';
      $(".add_log .job_code").append(option);
      $("#edit_modal #edit_job_code").append(option);
    });
  });

  // Populate Users & Project Logs =========================================================================
  $.each(all_users, function(i) {
    var option = '<option value="' + this.id + '">' + this.name + '</option>';
    $("#report_modal #report_user").append(option);
  });

  // View a Project's Logs =================================================================================
  var populate_logs = function populate_logs(logs) {
    current_logs = [];
    var total_hours = 0;
    if (logs.length > 0) {
      $.each(logs, function(i) {
        current_logs.push(this);

        $(".logs table tbody").append('<tr data-id="' + this._id + '" data-rev="' + this._rev + '"></tr>');

        var date = new Date(this.date);
        var dateString = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

        var row = $(".logs table tbody tr:last-child");
        row.append('<td class="center"><i class="fas fa-pen-square edit_log"></i><i class="far fa-minus-square delete_log"></i></td>');
        row.append('<td>' + dateString + '</td>');
        row.append('<td>' + this.user_name + '</td>');
        row.append('<td>' + this.project + '</td>');
        row.append('<td>' + this.job_code + '</td>');
        row.append('<td class="truncate" style="max-width:300px">' + this.description + '</td>');
        row.append('<td style="text-align:right">' + this.hours + '</td>');
        total_hours += parseFloat(this.hours);
      });

      $(".logs .total_hours").html(total_hours.toFixed(2));
    } else {
      $(".logs .total_hours").html("0");
      $(".logs tbody").append('<tr><td colspan="7" class="center"><i>No Logs Found</i></td></tr>');
    }

    $(".view-container").css("min-height", $(".view-container .logs").outerHeight());
  };

  $(document).on("click", ".projects .project", function() {
    var project_name = $(this).find(".name").text();
    $(".logs .project_name").html(project_name);
    $(".logs table tbody").html('');

    if ($(this).hasClass("active")) {
      $(".add_log select.project option[value='" + project_name + "']").prop('selected', true);
    }

    db.createIndex({
      index: {
        fields: ['date', 'project'],
        name: 'single_project_index',
        ddoc: 'single_project_index'
      }
    }).then(function (result) {
      return db.find({
        selector: {
          project: project_name,
          date: {$gt: null},
        },
        sort: [{date: 'desc'}],
      })
    }).then(function(docs) {
      populate_logs(docs.docs);
      $(".view-charts").show();
    }).catch(function (err) {
      console.log(err);
    });

    $(".view-container").removeClass("view_projects");
    $(".view-container").addClass("view_logs");
    $('html, body').animate({
      scrollTop: $(".logs").offset().top
    }, 1000);
  });

  // Reverse Animation
  $(document).on("click", ".logs .reverse", function() {
    $(".view-container").removeClass("view_logs");
    $(".view-container").addClass("view_projects");
  });

  // Add Rows and Logs =====================================================================================
  // Add Row
  $(".add_row").click(function() {
    var add_log = $(".add_log:first-child").clone();
    $(".add_log:last-child").after(add_log);
    $(".add_log:last-child").find("input").val('').removeClass("valid invalid");
    $(".add_log:last-child").find(".job_code2").html('');
    initMaterialize();
  });

  // Submit Log(s)
  $(".add_log_container .submit").click(function() {
    var logs = [];
    $(".add_log").each(function(i) {
      var id = new Date().toJSON() + i;
      var user_id = profile.id;
      var user_name = profile.name;
      var dateString = $(this).find(".datepicker").val();
      var date = new Date(dateString);
      var hours = $(this).find(".hours").val();
      var job_code = $(this).find(".job_code").val();
      var description = $(this).find(".description").val();
      var project = $(this).find(".project").val();

      if (job_code == null) {
        job_code = '';
      }

      // If Required Fields are Filled
      if (user_id != '' && date != '' && hours != '' && project != '') {
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
        logs.push(log);
      } else {
        M.toast({html: 'Fill Required Fields'});
      }
    });
    // If there are any logs to add
    if (logs.length > 0) {
      db.bulkDocs(logs);
      M.toast({html: 'Success!'});

      $(".add_log:first-child").find("input").val('').removeClass("valid invalid");
      $('.add_log .job_code').prop('selectedIndex',0);
      $('.add_log .project').prop('selectedIndex',0);
      $(".add_log:first-child").find(".job_code2").html('');
      $(".add_log:not(:first-child)").remove();
    }
  });

  // Remove Row
  $(document).on("click", ".remove_row", function() {
    var log = $(this).parents('.add_log');
    var index = log.index();
    if ($(".remove_row").length > 1) {
      log.remove();
    } else {
      M.toast({html: 'Cannot Remove'});
    }
  });

  // Delete Project Log ====================================================================================
  $(document).on("click", ".project_logs .delete_log", function() {
    var id = $(this).parents("tr").attr("data-id");
    var rev = $(this).parents("tr").attr("data-rev");
    var d = confirm("Are you sure you want to delete this log?");
    if (d) {
      db.remove(id, rev);
      M.toast({html: 'Successfully Deleted!'});
    }
  });

  // Edit Project Log ======================================================================================
  $(document).on("click", ".project_logs .edit_log", function() {
    var id = $(this).parents("tr").attr("data-id");
    var rev = $(this).parents("tr").attr("data-rev");
    var project = $(this).parents(".logs").find(".project_name").text();

    $("#edit_modal .project_name").text(project);
    $("#edit_modal").modal('open');

    db.get(id).then(function (doc) {
      var date = new Date(doc.date);
      var dateString = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

      $("#edit_modal #edit_log_id").val(id);
      $("#edit_modal #edit_log_rev").val(rev);
      $("#edit_modal #edit_user_name").val(doc.user_name);
      $("#edit_modal #edit_user_id").val(doc.user_id);
      $("#edit_modal #edit_date").val(dateString);
      $('#edit_modal .datepicker').datepicker({
        defaultDate: new Date(doc.date),
        setDefaultDate: true
      });
      $("#edit_modal #edit_project").val(doc.project); // Must get Project from doc
      $("#edit_modal #edit_job_code").val(doc.job_code);
      $("#edit_modal #edit_description").val(doc.description);
      $("#edit_modal #edit_hours").val(doc.hours);
    }).then(function() {
      $("#edit_modal label").addClass("active");
    }).catch(function (err) {
      console.log(err);
    });
  });

  $(document).on("click", "#edit_modal .submit", function(e) {
    var edit = $("#edit_modal");
    var id = edit.find("#edit_log_id").val();
    var rev = edit.find("#edit_log_rev").val();
    var user_id = parseInt(edit.find("#edit_user_id").val());
    var user_name = edit.find("#edit_user_name").val();
    var dateString = edit.find("#edit_date").val();
    var date = new Date(dateString);
    var hours = edit.find("#edit_hours").val();
    var job_code = edit.find("#edit_job_code").val();
    var description = edit.find("#edit_description").val();
    var project = edit.find("#edit_project").val();

    if (job_code == null) {
      job_code = '';
    }

    // If Required Fields are Filled
    if (id != '' && rev !='' && user_id != '' && date != '' && hours != '' && project != '') {
      var log = {
        '_id': id,
        '_rev': rev,
        'user_id': user_id,
        'user_name': user_name,
        'date': date,
        'hours': hours,
        'job_code': job_code,
        'description': description,
        'project': project
      }

      db.put(log).then(function() {
        M.toast({html: 'Successfully Updated!'});
        $(".logs .project_logs tbody").html('');
      })
      .catch(function (err) {
        console.log(err);
      });
    } else {
      M.toast({html: 'See Required Fields'});
    }
  });

  // Run Reports ===========================================================================================
  $(document).on("click", "#report_modal .submit", function() {
    var report = $("#report_modal");
    var users = $.map(report.find("#report_user").val(),Number);
    var projects = [];

    if (report.find("#report_project").val() == 'all') {
      $.each(all_projects, function(i) {
        projects.push(this.name);
      });
    } else {
      projects = report.find("#report_project").val();
    }

    var start_date = (report.find("#report_start_date").val() != '') ? new Date(report.find("#report_start_date").val()).toISOString() : null;
    var end_date = (report.find("#report_end_date").val() != '') ? new Date(report.find("#report_end_date").val()).toISOString() : new Date().toISOString();

    // If Users and Projects are chosen
    if (users.length > 0 && projects.length > 0) {

      $(".logs table tbody").html('');
      var total_hours = 0;

      db.createIndex({
        index: {
          fields: ['user_id', 'project', 'date'],
          name: 'report_index',
          ddoc: 'report_index'
        }
      }).then(function (result) {
        return db.find({
          selector: {
            user_id: {$or: users},
            project: {$or: projects},
            date: {
              $gte: start_date,
              $lte: end_date
            },
          },
          sort: [{'date': 'desc'}],
        });
      }).then(function(docs) {
        populate_logs(docs.docs);
        $(".view-charts").hide();
      }).catch(function (err) {
        console.log(err);
      });

      $('html, body').animate({
        scrollTop: $(".logs").offset().top
      }, 1000);
      if ($(".view-container").hasClass("view_projects")) {
        $(".view-container").removeClass("view_projects").addClass("view_logs");
      }

    } else {
      M.toast({html: 'Select Users & Projects'});
    }

  });

  // CSV Downlaod ==========================================================================================
  $(document).on("click", ".csv", function() {
    var csv_string = "data:text/csv;charset=utf-8, \nDate,User Name,Project,Job Code,Description,Hours\n";

    if (current_logs.length > 0) {
      $.each(current_logs, function(i) {
        var job_code = (this.job_code != '' && this.job_code != null) ? this.job_code : ' ';
        var description = (this.description != '' && this.description != null) ? this.description.toString() : ' ';
        description = description.replace(/[, ]+/g, " ").trim();
        var date_long = new Date(this.date);
        var date = (date_long.getMonth()+1) + "/" + date_long.getDate() + "/" + date_long.getFullYear();

        csv_line = date + "," + this.user_name + "," + this.project + "," + job_code + "," + description + "," + this.hours;
        csv_string += csv_line + "\n";
      });

      var encodedCSV = encodeURI(csv_string);
      $(this).attr("href", encodedCSV);
    } else {
      M.toast({html: 'No Logs Found'});
    }

  });

  // Store Data for Charts =================================================================================
  $(document).on("click", ".view-charts", function() {
    var project = $(".logs .project_name").text();
    localStorage.setItem("project",project);
    localStorage.setItem("company_db", company_db);
  });

  // Signout ===============================================================================================
  $(document).on("click", ".signout", function() {
    $.get("sign_out.php")
    .fail(function() {
      alert("Sorry, we could not log you out");
    })
    .done(function() {
      window.location.replace("index.php");
    });
  });

});
