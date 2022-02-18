var lati = "26.912434";
var logi = "75.787270";
var mapIdDays = {};
var serviceId = "";
var myparams = getQueryParameters();
var env = getCookie("env");
var dateWTBind = [];
var workType = "";
var workTypeNDays;
var appStartDateTime;
var appEndDateTime;
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  var crd = pos.coords;
  lati = crd.latitude;
  logi = crd.longitude;
  console.log("Your current position is:");
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}
$(document).ready(function () {
  navigator.geolocation.getCurrentPosition(success, error, options);
  $("#date").val(moment().format("YYYY-MM-DD"));
  console.log(env);
  console.log(lati);
  console.log(logi);
  if (myparams.id != null && myparams.phone != null && myparams.fname != null) {
    var updateData = {};
    updateData.lati = lati;
    updateData.logi = logi;
    if (myparams.id != null) {
      updateData.customerid = myparams.id;
    }
    if (myparams.fname != null) {
      updateData.fname = myparams.fname;
    }
    if (myparams.lname != null) {
      updateData.lname = myparams.lname;
    }
    if (myparams.phone != null) {
      updateData.phone = myparams.phone;
    }
    if (myparams.email != null) {
      updateData.email = myparams.email;
    }
    if (myparams.street != null) {
      updateData.street = myparams.street;
    }
    if (myparams.city != null) {
      updateData.city = myparams.city;
    }
    if (myparams.state != null) {
      updateData.state = myparams.state;
    }
    if (myparams.postalCode != null) {
      updateData.postalCode = myparams.postalCode;
    }
    //when env is null
    if (env == null || env == "") {
      $.ajax({
        async: true,
        crossDomain: false,
        url: "https://partial-welink1.cs197.force.com/services/apexrest/scheduleServiceAppointment",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "cache-control": "no-cache",
        },
        data: JSON.stringify({
          opName: "Access Token",
          customerData: "{}",
        }),
        success: function (res) {
          console.log("==res==", res);
          env = res;
          initialFirst(updateData, env);
          setCookie("env", res, 0.5);
        },
        error: function (err) {
          console.log("==err==", err);
          $(".loader").hide();
          $("#MainComp").html(
            '<div class="no_params" style="text-align: center;">\
              <img src="img/panda.png" />\
              <p><h2>Something went wrong..</h2></p>\
          </div>'
          );
        },
      });
    }

    //"opName": “Update Customer",
    if (env != null && env != "") {
      initialFirst(updateData, env);
    }
  } else {
    $(".loader").hide();
    $("#MainComp").html(
      '<div class="no_params" style="text-align: center;">\
        <img src="img/panda.png" />\
        <p><h2>Parameters are incomplete..</h2></p>\
    </div>'
    );
  }

  $("#get_appoint").click(function () {
    $(".loader").show();
    $("#section1").hide();
    $("#section2").show();
    var thisdate = $("#date").val();
    console.log("==thisdate===" + thisdate);
    var firstday = moment(thisdate).format("YYYY-MM-DD");
    var dayafter = moment(thisdate).add(1, "days").format("YYYY-MM-DD");
    if (workTypeNDays != null) {
      var dayafterwt = moment(thisdate)
        .add(workTypeNDays, "days")
        .format("YYYY-MM-DD");
    } else {
      var dayafterwt = "";
    }
    dateWTBind[firstday] = "firstday";
    dateWTBind[dayafter] = "dayafter";
    dateWTBind[dayafterwt] = "dayafterwt";
    workTypeNDays = mapIdDays[workType];
    console.log("===workTypeNDays===" + workTypeNDays);
    console.log("===mapIdDays===" + JSON.stringify(mapIdDays));
    if (workType != "") {
      $(".wtbutton")
        .text(mapIdDays[workType] + " DAYS AFTER SELECTED")
        .show();
    } else {
      $(".wtbutton").hide();
    }
    if (myparams.id != null && thisdate != null) {
      var data = {
        customerId: myparams.id,
        dt: thisdate,
        workTypeId: workType,
        lati: lati.toString(),
        logi: logi.toString(),
      };
      console.log("==data==" + data);
      getAppoint(env, data);
    }
  });

  $("#edit").click(function () {
    $("#section1").show();
    $("#section2").hide();
  });

  $("#confirm_appoint").click(function () {
    if (
      serviceId != null &&
      appStartDateTime != null &&
      appEndDateTime != null
    ) {
      $(".loader").show();
      $("#section2").hide();
      $("#section3").show();
      var data = {
        serviceId: serviceId,
        startTime: appStartDateTime,
        endTime: appEndDateTime,
      };
      confirmAppoint(env, data);
    } else {
      $(".validateMsg p").text(
        "Please select Time slot to confirm the appointment!"
      );
    }
  });

  $("#worktype").change(function () {
    if ($(this).val() != "") {
      $(".wtbutton").show();
      workType = $("#worktype").val();
      workTypeNDays = mapIdDays[workType];
    } else {
      $(".wtbutton").hide();
    }
  });
});

function confirmAppoint(env, data) {
  $.ajax({
    async: true,
    crossDomain: false,
    url: "https://partial-welink1.cs197.force.com/services/apexrest/scheduleServiceAppointment",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + env,
      "cache-control": "no-cache",
    },
    data: JSON.stringify({
      opName: "Schedule Appointment",
      customerData: JSON.stringify(data),
    }),
    success: function (result) {
      result = JSON.parse(result);
      console.log("==res1==", result);
      $(".loader").hide();
      $("#successImg").show();
      var retDate = moment(
        result.ServiceAppointment.ArrivalWindowStartTime
      ).format("dddd, MMMM D, YYYY");
      var retStartTime = moment(
        result.ServiceAppointment.ArrivalWindowStartTime
      ).format("HH:mm");
      var retEndTime = moment(
        result.ServiceAppointment.ArrivalWindowEndTime
      ).format("HH:mm");
      var msg =
        "The appointment is scheduled from " +
        retDate +
        " " +
        retStartTime +
        " to " +
        retEndTime;
      $(".finalMsg").text(msg);
    },
    error: function (err) {
      console.log("==err==", JSON.parse(err.responseText));
      var msg = JSON.parse(err.responseText).message;
      $(".finalMsg").text(msg);
      $(".loader").hide();
      $("#errorImg").show();
    },
  });
}

//show all time slots card
function showAll() {
  $(".timeslotloop").show();
}
//show time slot cards of selected date
function showFirstDate() {
  $(".timeslotloop").hide();
  $('div[data-wtd="firstday"]').show();
}
//show time slot cards date comes after selected date
function showDayAfter() {
  $(".timeslotloop").hide();
  $('div[data-wtd="dayafter"]').show();
}
//show time slot card of WT offset date
function showWtSlot() {
  $(".timeslotloop").hide();
  $('div[data-wtd="dayafterwt"]').show();
}

function selectSlot(event) {
  let index = $(event).data("index");
  $(".time_slot_list li").removeClass("tsactive");
  $(event).addClass("tsactive");
  appStartDateTime =
    $(event).data("date") + " " + $(event).data("start") + ":00";
  appEndDateTime = $(event).data("date") + " " + $(event).data("end") + ":00";
  serviceId = $(event).data("sid");
  console.log(appStartDateTime + "  " + appEndDateTime + "  " + serviceId);
}

function getAppoint(env, data) {
  $.ajax({
    async: true,
    crossDomain: false,
    url: "https://partial-welink1.cs197.force.com/services/apexrest/scheduleServiceAppointment",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + env,
      "cache-control": "no-cache",
    },
    data: JSON.stringify({
      opName: "Get Appointment",
      customerData: JSON.stringify(data),
    }),
    success: function (result) {
      result = JSON.parse(result);
      console.log("==res==", result);
      serviceId = result.ServiceId ? result.ServiceId : null;
      var TimeSlots = result.TimeSlots ? result.TimeSlots : [];
      var timeslotjson = [];
      var indv = 0;
      var slotsHtml = "";
      if (TimeSlots) {
        $("#confirm_appoint").show();
        for (let key in TimeSlots) {
          var datev = moment(key).format("YYYY-MM-DD");
          var displaydatev = moment(key).format("dddd, MMMM D, YYYY");
          var tsinloop = [];
          slotsHtml +=
            '<div class="time-section-main timeslotloop" data-wtd="' +
            dateWTBind[datev] +
            '" key="' +
            key +
            '">\
                          <div class="time-selection">\
                              <h4>' +
            displaydatev +
            '</h4>\
                          </div>\
                          <div class="choose-time">\
                                        <ul class="time_slot_list">';
          if (Array.isArray(TimeSlots[key])) {
            for (let k2 in TimeSlots[key]) {
              indv++;
              var split = TimeSlots[key][k2].split("---");
              var startv = split[0].replace(":00.000Z", "");
              var endv = split[1].replace(":00.000Z", "");
              var sidv = split[2];
              //tsinloop.push({ ind: indv, start: startv, end: endv, sid: sidv });
              slotsHtml +=
                '<li key="' +
                indv +
                '" onclick="selectSlot(this)" data-index="' +
                indv +
                '"\
													data-date="' +
                datev +
                '" data-start="' +
                startv +
                '" data-end="' +
                endv +
                '" data-sid="' +
                serviceId +
                '">\
													' +
                startv +
                " - " +
                endv +
                "</li>";
            }
          } else {
            slotsHtml += "<li>No Slots Available!</li>";
          }
          // timeslotjson.push({date: datev,displayDate: displaydatev,cssclass: dateWTBind[datev],timeslots: tsinloop});
          slotsHtml += "</ul>\
                  </div>\
                </div>";
        }
      } else {
        slotsHtml =
          '<div class="no_params" style="text-align: center;">\
          <p><h2>No Time Slots!</h2></p>\
        </div>';
        $("#confirm_appoint").hide();
      }
      $(".loader").hide();
      $("#slotsArea").html(slotsHtml);
    },
    error: function (err) {
      console.log("==err==", err);
      $(".loader").hide();
      $("#slotsArea").html(
        '<div class="no_params" style="text-align: center;">\
        <p><h2>No Time Slots!</h2></p>\
      </div>'
      );
      $("#confirm_appoint").hide();
    },
  });
}

function initialFirst(updateData, env) {
  $.ajax({
    async: true,
    crossDomain: false,
    url: "https://partial-welink1.cs197.force.com/services/apexrest/scheduleServiceAppointment",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + env,
      "cache-control": "no-cache",
    },
    data: JSON.stringify({
      opName: "Update Customer",
      customerData: JSON.stringify(updateData),
    }),
    success: function (res) {
      res = JSON.parse(res);
      console.log("==res==", res);
      var address = "";
      if (res.Account != undefined) {
        res = res.Account;
        address += res.ShippingStreet ? res.ShippingStreet : "";
        address += res.ShippingCity ? ", " + res.ShippingCity : "";
        address += res.ShippingState ? ", " + res.ShippingState : "";
        address += res.ShippingPostalCode ? ", " + res.ShippingPostalCode : "";
      } else {
        res = res.Lead;
        address += res.Street ? res.Street : "";
        address += res.City ? ", " + res.City : "";
        address += res.State ? ", " + res.State : "";
        address += res.PostalCode ? ", " + res.PostalCode : "";
      }
      address = address != "" ? "at " + address : "";
      $(".cname").text(res.Name);
      $(".address").text(address);
      $(".loader").hide();
    },
    error: function (err) {
      console.log("==err==", err);
      $(".loader").hide();
    },
  });

  //get work types
  $.ajax({
    async: true,
    crossDomain: false,
    url: "https://partial-welink1.cs197.force.com/services/apexrest/scheduleServiceAppointment",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + env,
      "cache-control": "no-cache",
    },
    success: function (res) {
      console.log("==res==", res);

      //res = JSON.parse(res);
      var options = "";
      res.forEach(function (item) {
        options +=
          '<option  value="' + item.Id + '">' + item.MasterLabel + "</option>";
        mapIdDays[item.Id] = item.Number_Of_Days_Out__c;
      });
      $("#worktype").append(options);
    },
    error: function (err) {
      console.log("==err==", err);
    },
  });
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function getQueryParameters() {
  var params = {};
  var search = location.search.substring(1);
  if (search) {
    params = JSON.parse(
      '{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
      (key, value) => {
        return key === "" ? value : decodeURIComponent(value);
      }
    );
  }
  return params;
}

function getHeaders() {
  var req = new XMLHttpRequest();
  req.open("GET", document.location, false);
  req.send(null);

  // associate array to store all values
  var data = new Object();

  // get all headers in one call and parse each item
  var headers = req.getAllResponseHeaders().toLowerCase();
  var aHeaders = headers.split("\n");
  var i = 0;
  for (i = 0; i < aHeaders.length; i++) {
    var thisItem = aHeaders[i];
    var key = thisItem.substring(0, thisItem.indexOf(":"));
    var value = thisItem.substring(thisItem.indexOf(":") + 1);
    data[key] = value;
  }

  // get referer
  var referer = document.referrer;
  data["Referer"] = referer;

  //get useragent
  var useragent = navigator.userAgent;
  data["UserAgent"] = useragent;

  //extra code to display the values in html
  var display = "";
  for (var key in data) {
    if (key != "") display += "<b>" + key + "</b> : " + data[key] + "<br>";
  }
  return data;
}
