var lati='26.912434';
var logi='75.787270'; 
$(document).ready(function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      lati = position.coords.latitude; logi = position.coords.longitude;
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
  var myparams = getQueryParameters();
  $('#date').val(moment().format('YYYY-MM-DD'));
  var env = getCookie('env');
  console.log(env);
  console.log(lati);
  console.log(logi);
  if (myparams.id != null && myparams.phone != null && myparams.fname != null) {

    //when env is null
    if(env == null || env == ''){
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
          "opName": "Access Token",
          "customerData": "{}"
        }),
        success: function (res) {
          console.log("==res==", res);
          setCookie('env',res,1);
        },
        error: function (err) {
          console.log("==err==", err);
        },
      });
    }

    var fname = myparams.fname ? myparams.fname : '';
    var lname = myparams.lname ? myparams.lname : '';
    var phone = myparams.phone ? myparams.phone : '';
    var email = myparams.email ? myparams.email : '';
    var street = myparams.street ? myparams.street : '';
    var city = myparams.city ? myparams.city : '';
    var state = myparams.state ? myparams.state : '';
    var postalCode = myparams.postalCode ? myparams.postalCode : '';

    //"opName": “Update Customer",
    if(env!=null && env!=''){
      $.ajax({
        async: true,
        crossDomain: false,
        url: "https://partial-welink1.cs197.force.com/services/apexrest/scheduleServiceAppointment",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+env,
          "cache-control": "no-cache",
        },
        data: JSON.stringify({
          "opName": "Update Customer",
          // "customerData": {
          //   "customerId":myparams.id,
          //   "phone":myparams.phone,
          //   "fname":myparams.fname,
          //   "lname":myparams.lname,
          //   "email":myparams.email,
          //   "street":myparams.street,
          //   "city":myparams.city,
          //   "state":myparams.state,
          //   "postalCode":myparams.postalCode,
          // }
          "customerData": "{\n  \"customerid\":\""+myparams.id+"\",\"fname\":\""+fname+"\",\"lname\":\""+lname+"\",\"phone\":\""+phone+"\",\"email\":\""+email+"\",\"lati\":\""+lati+"\",\"logi\":\""+logi+"\",\"street\":\""+street+"\",\"city\":\""+city+"\",\"state\":\""+state+"\",\"postalCode\":\""+postalCode+"\"}"
        }),
        success: function (res) {
          res = JSON.parse(res);
          console.log("==res==", res);
          $('.cname').text(res.Name);
        },
        error: function (err) {
          console.log("==err==", err);
        },
      });

    }
  }

  $('#get_appoint').click(function(){
    $('#section1').hide();
    $('#section2').show();
  });

  $('#edit').click(function(){
    $('#section1').show();
    $('#section2').hide();
  });

  $('#confirm_appoint').click(function(){
    $('#section2').hide();
    $('#section3').show();
  });
  
});



function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
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
      params = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', (key, value) => {
          return key === "" ? value : decodeURIComponent(value)
      });
  }
  return params;
}

function getHeaders() {
  var req = new XMLHttpRequest();
  req.open('GET', document.location, false);
  req.send(null);

  // associate array to store all values
  var data = new Object();

  // get all headers in one call and parse each item
  var headers = req.getAllResponseHeaders().toLowerCase();
  var aHeaders = headers.split('\n');
  var i = 0;
  for (i = 0; i < aHeaders.length; i++) {
      var thisItem = aHeaders[i];
      var key = thisItem.substring(0, thisItem.indexOf(':'));
      var value = thisItem.substring(thisItem.indexOf(':') + 1);
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
      if (key != "")
          display += "<b>" + key + "</b> : " + data[key] + "<br>";
  }
  return data;
}
