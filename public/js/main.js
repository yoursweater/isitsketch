
$(document).ready(function() {

  console.log('script loaded')

/////////////AJAX CALLS//////////////

  var root = 'https://data.cityofnewyork.us/resource/dvh8-u7es.json?$where=within_circle(location_1,%2040.762027813,%20-73.999059288,%20200)and%20occurrence_year%20=%202015';

  $.ajax({
    dataType: 'json',
    url: root,
    method: 'GET'
  }).then(function(data) {
    console.log(data)
  });



//////////////SKETCH CALCULATOR////////////////
const geocoder = require('node-geocoder')
var geocoderProvider = 'google';
var httpAdapter = 'http';var extra = {
    apiKey: 'AIzaSyCntAAyLzBvr5AnPIyqQXmObbtybrkPlr0', // for map quest
    formatter: null         // 'gpx', 'string', ...
};

geocoder.getGeocoder(geocoderProvider, httpAdapter, extra);

// Using callback
geocoder.geocode('29 champs elysée paris', function(err, res) {
    console.log(res);
});



});

