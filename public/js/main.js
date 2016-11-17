$(document).ready(function() {

  console.log('script loaded')



/////////////Geocoder//////////////
  var mapsToken = "AIzaSyDPMSlU4RW9QMz8ceTsBbBevwtLJvOLDAQ";
  var userAddress;
  var address;
  var myLongitude;
  var myLatitude;
  var search = $('.location-form');

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
        console.log("My longitude is: " + myLongitude + " and my latitude is: " + myLatitude)
        getOpendata();
      }
    })
  })

//////////////////NYC OPENDATA///////////////////

  var getOpendata = function () {
    var root = 'https://data.cityofnewyork.us/resource/57mv-nv28.json?$query=SELECT%20ofns_desc%20WHERE%20within_circle(lat_lon,%20'+myLatitude+',%20'+myLongitude+',%20100)%20AND%20cmplnt_fr_dt%20%3E=%20%272013-12-31T00:00:00%27';

    $.ajax({
      dataType: 'json',
      url: root,
      method: 'GET'
    }).then(function(data) {
      console.log(data)
      console.log(data[0]['ofns_desc'])
      // sketchCalc(data);
    });
  }

//Add this to the end of the query to get 3 years' worth of data instead:
// %20or%20occurrence_year%20=%202014%20or%20occurrence_year%20=%202013

//////////////SKETCH CALCULATOR////////////////

/*
Rape: 25
Robbery: 10
Homicide: 70
Grand Larceny: none
Grand Theft Auto: none
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

  var rape2 = 0
  var robbery2 = 0
  var homicide2 = 0
  var grandLarceny2 = 0
  var gta2 = 0
  var burglary2 = 0
  var assault2 = 0

  var rape3 = 0
  var robbery3 = 0
  var homicide3 = 0
  var grandLarceny3 = 0
  var gta3 = 0
  var burglary3 = 0
  var assault3 = 0



    for(i = 0; i < input.length; i++){
      if(input[i]['offense'] == "RAPE"){
          if(input[i]['compstat_year'] == "2015"){
            rape++
          }
          if(input[i]['compstat_year'] == "2014"){
            rape2++
          }
          if(input[i]['compstat_year'] == "2013"){
            rape3++
          }
      }
      if(input[i]['offense'] == "ROBBERY"){
          if(input[i]['compstat_year'] == "2015"){
            robbery++
          }
          if(input[i]['compstat_year'] == "2014"){
            robbery2++
          }
          if(input[i]['compstat_year'] == "2013"){
            robbery3++
          }
      }
      if(input[i]['offense'] == "MURDER & NON-NEGL. MANSLAUGHTE"){
          if(input[i]['compstat_year'] == "2015"){
            homicide++
          }
          if(input[i]['compstat_year'] == "2014"){
            homicide2++
          }
          if(input[i]['compstat_year'] == "2013"){
            homicide3++
          }
      }
      if(input[i]['offense'] == "GRAND LARCENY"){
          if(input[i]['compstat_year'] == "2015"){
            grandLarceny++
          }
          if(input[i]['compstat_year'] == "2014"){
            grandLarceny2++
          }
          if(input[i]['compstat_year'] == "2013"){
            grandLarceny3++
          }
      }
      if(input[i]['offense'] == "GRAND LARCENY OF MOTOR VEHICLE"){
          if(input[i]['compstat_year'] == "2015"){
            gta++
          }
          if(input[i]['compstat_year'] == "2014"){
            gta2++
          }
          if(input[i]['compstat_year'] == "2013"){
            gta3++
          }
      }
      if(input[i]['offense'] == "BURGLARY"){
          if(input[i]['compstat_year'] == "2015"){
            burglary++
          }
          if(input[i]['compstat_year'] == "2014"){
            burglary2++
          }
          if(input[i]['compstat_year'] == "2013"){
            burglary3++
          }
      }
      if(input[i]['offense'] == "FELONY ASSAULT"){
          if(input[i]['compstat_year'] == "2015"){
            assault++
          }
          if(input[i]['compstat_year'] == "2014"){
            assault2++
          }
          if(input[i]['compstat_year'] == "2013"){
            assault3++
          }
      }
    }
console.log(numOffenses)
console.log(rape + rape2 + rape3 + " rapes.")
console.log(robbery + robbery2 + robbery3 + " robberies.")
console.log(homicide + homicide2 + homicide3 + " homicides.")
console.log(grandLarceny + grandLarceny2 + grandLarceny3 + " thefts.")
console.log(gta + gta2 + gta3 + " stolen cars.")
console.log(burglary + burglary2 + burglary3 + " burglaries.")
console.log(assault + assault2 + assault3 + " assaults.")

var totalrape = (rape + rape2 + rape3)
var totalrobbery = (robbery + robbery2 + robbery3)
var totalhomicide = (homicide + homicide2 + homicide3)
var totalburglary = (burglary + burglary2 + burglary3)
var totalassault = (assault + assault2 + assault3)

var sketch2015 = (((rape*25)+(robbery*10)+(homicide*70)+(burglary*8)+(assault*20))*.8)
var sketch2014 = (((rape2*25)+(robbery2*10)+(homicide2*70)+(burglary2*8)+(assault2*20))*.6)
var sketch2013 = (((rape3*25)+(robbery3*10)+(homicide3*70)+(burglary3*8)+(assault3*20))*.4)

var totalSketch = (sketch2013 + sketch2014 + sketch2015)
console.log("Your sketch level is: " + totalSketch)

}

});
