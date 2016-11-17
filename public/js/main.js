$(document).ready(function() {

  console.log('script loaded')



  var precinctNumber
  var search = $('.location-form');

  //var userAddress = "10 E 21st St, New York NY"
  search.submit(function(s){
    console.log("clicked");
    s.preventDefault();
    precinctNumber = $(this).children('input[name=precinct]').val();
    console.log(precinctNumber);
});


//////////////////NYC OPENDATA///////////////////

  // var getOpendata = function () {
  //   var root = 'https://data.cityofnewyork.us/resource/dvh8-u7es.json?$where=within_circle(location_1,%20'+myLatitude+',%20'+myLongitude+',%20500)and%20occurrence_year%20=%202015';

  //   $.ajax({
  //     dataType: 'json',
  //     url: root,
  //     method: 'GET'
  //   }).then(function(data) {
  //     console.log(data)
  //     sketchCalc(data);
  //   });
  // }


});
