$(document).ready(function() {
      //$('#click').on('click',function(){
      $.ajax({
          "async": true,
          "crossDomain": false,
          "url": "https://partial-welink1.cs197.force.com/services/apexrest/scheduleServiceAppointment",
          "method": "POST",
          "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache",
            "postman-token": "ecf50a87-1531-23b7-900d-d79cd4163d1f"
          },
          "data": {
            "opName": "Access Token",
            "customerData": "{}",

          },
          success: function(res) {
            console.log('==res==', res);
          },
          error: function(err) {
            console.log('==err==', err);

          }
         });
        //});
	});

