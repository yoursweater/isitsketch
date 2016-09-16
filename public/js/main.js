
$(document).ready(function() {

  console.log('script loaded')


/////////////Geocoder//////////////
  var mapsToken = "AIzaSyDPMSlU4RW9QMz8ceTsBbBevwtLJvOLDAQ";
  var userAddress;
  var address;
  var myLongitude;
  var myLatitude;
  var myNeighborhood;
  var search = $('.location-form');
  var ntaLocationArr = [];
  var ntaArray = [];


  //var userAddress = "10 E 21st St, New York NY"
  search.submit(function(s){
    console.log("clicked");
    s.preventDefault();
    userAddress = $(this).children('input[name=location]').val();
    address = userAddress.replace(/\s+/g, '+');
    console.log(address);


    $.ajax({                                  // Initial call to Google Maps
      method: "GET",
      url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address +"&key="+mapsToken,
      success: function(data){
        myLongitude = data['results'][0]['geometry']['location']['lng'];
        myLatitude = data['results'][0]['geometry']['location']['lat'];
        myNeighborhood = data['results'][0]['address_components'][2]['long_name'];
        console.log("My longitude is: " + myLongitude + " and my latitude is: " + myLatitude + " and the neighborhood is " + myNeighborhood)
        getOpendata();
        getNtaNames();
      }
    })
  })

//////////////////NYC OPENDATA///////////////////

  var getOpendata = function () {
    var root = 'https://data.cityofnewyork.us/resource/dvh8-u7es.json?$where=within_circle(location_1,%20'+myLatitude+',%20'+myLongitude+',%20500)and%20occurrence_year%20=%202015';

    $.ajax({
      dataType: 'json',
      url: root,
      method: 'GET'
    }).then(function(data) {
      sketchCalc(data);
    });
  }
//////////////GET NEIGHBORHOOD POPULATION//////////////////
var getNtaNames = function(){
  var root = 'https://data.cityofnewyork.us/resource/wwhg-3wy7.json'
  $.ajax({
    dataType: 'json',
    url: root,
    method: 'GET',
  }).then(function(data){
      for(i=0; i<data.length; i++){
        var ntaName = data[i]['nta_name']
        var ntaPop = data[i]['population']

        item = {}
        item['name'] = ntaName
        item['population'] = ntaPop
        item['latitude'] = ''
        item['longitude'] = ''
        item['zip'] = ''
        ntaArray.push(item);

      }
        ntaArray.forEach(getNtaLocation);
        // console.log(ntaArray)
    })
  }

    var getNtaLocation = function(obj){
      var ntaName = (obj['name'])
      $.ajax({
        dataType: 'json',
        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + ntaName +"+nyc&key="+mapsToken,
        method: 'GET',
        success: function(data){
          longitude = data['results'][0]['geometry']['location']['lng'];
          latitude = data['results'][0]['geometry']['location']['lat'];
          obj['latitude'] = latitude
          obj['longitude'] = longitude
          // console.log(obj)
          getNtaZip(obj)
          }

      })
    };

    var getNtaZip = function(obj){
      var ntaLocation = (obj['latitude'] + ',' + obj['longitude'])
            $.ajax({
              dataType: 'json',
              url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + ntaLocation +"&key="+mapsToken,
              method: 'GET',
              success: function(data){
                zip = data['results'][0]['address_components'][7]['long_name']
                obj['zip'] = zip
                console.log(obj)
                }

            })
          };






//////////////SKETCH CALCULATOR////////////////

/*
Rape: 25
Robbery: 10
Homicide: 30
Grand Larceny: 1
Grand Theft Auto: 6
Burglary: 8
Felony Assault: 20
*/

function sketchCalc(input){
  var numOffenses = input.length
  var rape = 0
  var robbery = 0
  var homicide = 0
  var grandLarceny = 0
  var gta = 0
  var burglary = 0
  var assault = 0


  // console.log(input[0]['offense'])

    for(i = 0; i < input.length; i++){
      if(input[i]['offense'] == "RAPE"){
        rape++
      }
      if(input[i]['offense'] == "ROBBERY"){
        robbery++
      }
      if(input[i]['offense'] == "MURDER & NON-NEGL. MANSLAUGHTE"){
        homicide++
      }
      if(input[i]['offense'] == "GRAND LARCENY"){
        grandLarceny++
      }
      if(input[i]['offense'] == "GRAND LARCENY OF MOTOR VEHICLE"){
        gta++
      }
      if(input[i]['offense'] == "BURGLARY"){
        burglary++
      }
      if(input[i]['offense'] == "FELONY ASSAULT"){
        assault++
      }
    }
// console.log(numOffenses)
// console.log(rape)
// console.log(robbery)
// console.log(homicide)
// console.log(grandLarceny)
// console.log(gta)
// console.log(burglary)
// console.log(assault)

  var totalSketch = ((rape*25)+(robbery*10)+(homicide*30)+(grandLarceny)+(gta*6)+(burglary*8)+(assault*20))
// console.log("Your sketch level is: " + totalSketch)

}

});

