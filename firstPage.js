
$(document).ready(function() {
    //$('#click').click(function(){
    $.ajax({
            "async": true,
            "crossDomain": false,
            "url": "https://cs197.salesforce.com/services/oauth2/token?grant_type=password&client_id=3MVG9M43irr9JAuxkb7Yhz0ny5xMRoh1Cpb9N_P94sApGZqkKEyVxqLIDj.UZq73hyCcPv9PvaX0BWyheVKnu&client_secret=F11DEA7D4AF3D2E4D9D142BB602D8A1B46A58C245DCB815A0964336B11

$(document).ready(function() {
    //$('#click').click(function(){
    $.ajax({
            "async": true,
            "crossDomain": false,
            "url": "https://cs197.salesforce.com/services/oauth2/token?grant_type=password&client_id=3MVG9M43irr9JAuxkb7Yhz0ny5xMRoh1Cpb9N_P94sApGZqkKEyVxqLIDj.UZq73hyCcPv9PvaX0BWyheVKnu&client_secret=F11DEA7D4AF3D2E4D9D142BB602D8A1B46A58C245DCB815A0964336B1172130C&username=sandeep.singhal%40zordial.com.welink.partial&password=Ztech%23123ajQlsgySQswXjiImgfS8uVRjo#2k22",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "cache-control": "no-cache",
                "postman-token": "ecf50a87-1531-23b7-900d-d79cd4163d1f"
            },
            "data": {
                "grant_type": "password",
                "client_id": "3MVG9M43irr9JAuxkb7Yhz0ny5xMRoh1Cpb9N_P94sApGZqkKEyVxqLIDj.UZq73hyCcPv9PvaX0BWyheVKnu",
                "client_secret": "F11DEA7D4AF3D2E4D9D142BB602D8A1B46A58C245DCB815A0964336B1172130C",
                "username": "sandeep.singhal@zordial.com.welink.partial",
                "password": "Ztech#123ajQlsgySQswXjiImgfS8uVRjo"
            },
            success: function(res) {
                console.log(res);
            },
            error: function() {


            });
        //});

        $('#click').click(function() {

        });
    });
