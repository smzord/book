$(document).ready(function () {
  var myparams = getQueryParameters();
  $('#date').val(moment().format('YYYY-MM-DD'));
  var env = getCookie('env');

  if (myparams.id != null && myparams.phone != null && myparams.firstname != null) {

    //when env is null
    if(env == null){
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
          //console.log("==res==", res);
          setCookie('env',res);
        },
        error: function (err) {
          console.log("==err==", err);
        },
      });
    }

    //"opName": “Update Customer",
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
        "opName": "Update Customer",
        "customerData": {
          "customerId":myparams.id,
          "phone":myparams.phone,
          "fname":myparams.fname,
          "lname":myparams.lname,
          "email":myparams.email,
          "street":myparams.street,
          "city":myparams.city,
          "state":myparams.state,
          "postalCode":myparams.postalCode,
        }
      }),
      success: function (res) {
        console.log("==res==", res);
        
      },
      error: function (err) {
        console.log("==err==", err);
      },
    });
  }

  
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
