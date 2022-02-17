$(document).ready(function () {
  var myparams = getQueryParameters();
  $('#date').value(moment().format('YYYY-MM-DD'));
  if (myparams.id != null && myparams.phone != null && myparams.firstname != null) {
    $.ajax({
      async: true,
      crossDomain: false,
      url: "https://partial-welink1.cs197.force.com/services/apexrest/scheduleServiceAppointment",
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "postman-token": "ecf50a87-1531-23b7-900d-d79cd4163d1f",
      },
      data: {
        opName: "Access Token",
        customerData: "{}",
      },
      success: function (res) {
        console.log("==res==", res);
      },
      error: function (err) {
        console.log("==err==", err);
      },
    });
  }
});



getQueryParameters() {
  var params = {};
  var search = location.search.substring(1);
  if (search) {
      params = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', (key, value) => {
          return key === "" ? value : decodeURIComponent(value)
      });
  }
  return params;
}

getHeaders() {
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
