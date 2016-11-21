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
    var root = 'https://data.cityofnewyork.us/resource/57mv-nv28.json?$query=SELECT%20ofns_desc%20WHERE%20within_circle(lat_lon,%20'+myLatitude+',%20'+myLongitude+',%20200)%20AND%20cmplnt_fr_dt%20%3E=%20%272013-12-31T00:00:00%27';

    $.ajax({
      dataType: 'json',
      url: root,
      method: 'GET'
    }).then(function(data) {
      console.log(data)
      console.log(data[0]['ofns_desc'])
      sketchCalc(data);
    });
  }


//////////////SKETCH CALCULATOR////////////////



function sketchCalc(input){
  var numOffenses = input.length;
  var rapes = 0;
  var robberies = 0;
  var assaults = 0;
  var burglaries = 0;
  var thefts = 0;
  var weapons = 0;

    for(i = 0; i < input.length; i++){
      if(input[i]['ofns_desc'] === "RAPE"){
            rapes++
        }
      if(input[i]['ofns_desc'] === "ROBBERY"){
            robberies++
        }
      if(input[i]['ofns_desc'] === "FELONY ASSAULT"){
            assaults++
        }
      if(input[i]['ofns_desc'] === "BURGLARY"){
            burglaries++
        }
      if(input[i]['ofns_desc'] === "ASSAULT 3 & RELATED OFFENSES"){
            assaults++
        }
      if(input[i]['ofns_desc'] === "PETIT LARCENY"){
            thefts++
        }
      if(input[i]['ofns_desc'] === "GRAND LARCENY"){
            thefts++
        }
      if(input[i]['ofns_desc'] === "DANGEROUS WEAPONS"){
            weapons++
        }
    }

  console.log(numOffenses)
  console.log("total rapes: " + rapes)
  console.log("total robberies: " + robberies)
  console.log("total assaults: " + assaults)
  console.log("total burglaries: " + burglaries)
  console.log("total thefts: " + thefts)
  console.log("total weapons: " + weapons)

  //Methodology:

  //Various offenses are weighted for sketchiness according to my completely arbitrary rating.
  //However, thefts are in fact negatively correlated with sketchiness.
  //The reason for this is that although theft is a crime, it tends to occur where
  //there are greater numbers of peopl (hence more chances to steal) and more stores to rob from.
  //The presence of stores to rob from is an indication of commerce, and hence,
  //police presence. Accordingly, despite the high number of thefts in Times Square,
  //one would be unlikely to say that it's sketchier than Bed-Stuy.

  var sketchLevel = ((rapes*10) + (robberies*5) + (assaults*9) + (weapons*8) + (burglaries*7) - (thefts))

  console.log("Your sketch level is: " + sketchLevel)

  if(sketchLevel <= 500){
    $(".response").remove()
    $("#results").append("<p class='response'>Your area is safe.</p>");
  }
  if(sketchLevel > 500 && sketchLevel <= 1000){
    $(".response").remove()
    $("#results").append("<p class='response'>Your hood is slightly sketchy.</p>");
  }
  if(sketchLevel > 1000 && sketchLevel <= 1500){
    $(".response").remove()
    $("#results").append("<p class='response'>Your hood is pretty sketchy.</p>");
  }
  if(sketchLevel > 1500){
    $(".response").remove()
    $("#results").append("<p class='response'>GET THE FUCK OUTTA THERE</p>");
  }

  $('html, body').animate({
    scrollTop: $("#results").offset().top
  }, 1000);

}

});
