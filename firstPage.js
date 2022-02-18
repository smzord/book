var lati = "26.912434";
var logi = "75.787270";
var mapIdDays = {};
$(document).ready(function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      lati = position.coords.latitude;
      logi = position.coords.longitude;
      console.log('==position.coords=='+JSON.stringify(position.coords));
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
  var myparams = getQueryParameters();
  $("#date").val(moment().format("YYYY-MM-DD"));
  var env = getCookie("env");
  var dateWTBind = [];
  var workType = '';
  var workTypeNDays;
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
        },
      });
    }

    //"opName": “Update Customer",
    if (env != null && env != "") {
      initialFirst(updateData, env);
    }
  }else{
    $('#MainComp').html('<div class="no_params">\
        <img src="img/panda.png" />\
        <p><h2>Parameters are incomplete..</h2></p>\
    </div>');
  }

  $("#get_appoint").click(function () {
    $(".loader").show();
    $("#section1").hide();
    $("#section2").show();
    var thisdate = $('#date').val();
    console.log('==thisdate==='+thisdate);
    var firstday = moment(thisdate).format('YYYY-MM-DD');
    var dayafter = moment(thisdate).add(1,'days').format('YYYY-MM-DD');
    if(workTypeNDays!=null){
        var dayafterwt = moment(thisdate).add(workTypeNDays,'days').format('YYYY-MM-DD');
    }else{
        var dayafterwt = '';
    }
    dateWTBind[firstday] = 'firstday';
    dateWTBind[dayafter] = 'dayafter';
    dateWTBind[dayafterwt] = 'dayafterwt';
    workTypeNDays = mapIdDays[workType];
    console.log("===workTypeNDays==="+workTypeNDays);
    console.log("===mapIdDays==="+JSON.stringify(mapIdDays));
    if(workType!=''){
      $('.wtbutton').text(mapIdDays[workType] + ' DAYS AFTER SELECTED').show();
    }else{
      $('.wtbutton').hide();
    }
    if (myparams.id != null && thisdate != null) {
      var data = JSON.stringify({
        "customerId":myparams.id,
        "dt":thisdate,
        "workTypeId":workType,
        "lati":lati.toString(),
        "logi":logi.toString(),
      });
      console.log('==data=='+data);
      getAppoint(env,data);
    }
  });

  $("#edit").click(function () {
    $("#section1").show();
    $("#section2").hide();
  });

  $("#confirm_appoint").click(function () {
    $("#section2").hide();
    $("#section3").show();
  });

  $('#worktype').change(function(){
    if($(this).val()!=''){
      $('.wtbutton').show();
      workType = $('#worktype').val();
      workTypeNDays = mapIdDays[workType];
    }else{
      $('.wtbutton').hide();
    }
  });

});

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

function getAppoint(env,data) {
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
    success: function (res) {
      res = JSON.parse(res);
      console.log("==res==", res);
      $(".loader").hide();
    },
    error: function (err) {
      console.log("==err==", err);
      $(".loader").hide();
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
