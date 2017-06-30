$(document).ready(function() {
  console.log('script loaded')
  $('#display').fadeToggle(2000, 'linear')

/////////////Variables//////////////

  var mapsToken = "AIzaSyDPMSlU4RW9QMz8ceTsBbBevwtLJvOLDAQ";
  var userAddress;
  var address;
  var myLongitude;
  var myLatitude;
  var search = $('.location-form');
  var userAddress = "10 E 21st St, New York NY"

////////////Form//////////////////

  $('.location-form').keypress(function(event){
    if (event.which == 13){
        console.log('search entered')
        event.preventDefault();
        userAddress = $("#input1").val()
        address = userAddress.replace(/\s+/g, '+');
        getMaps(address)
        return false;
    } else {
        return true;
    }
  });

///////////Loading Animation///////

function loadScreen(sketchLevel, robberies, assaults, burglaries, thefts, weapons) {
  $('#load').fadeTo('slow', 1, function(){
    $('#mainTitle').fadeTo('slow',0)
    $('.location-form').fadeTo('slow',0)
    $('#load').delay(2200).fadeTo('slow',0, displayResults(sketchLevel, robberies, assaults, burglaries, thefts, weapons));
  });
}

/////////////Display Results/////////////////

function displayResults(sketchLevel, robberies, assaults, burglaries, thefts, weapons) {
  console.log('sketch level coming in:' + sketchLevel)
  console.log('there were this many robberies' + robberies)
}

///////////Maps/////////////////

  function getMaps(address){
      $.ajax({
      method: "GET",
      url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address +"&key="+mapsToken,
      success: function(data){
        myLongitude = data['results'][0]['geometry']['location']['lng'];
        myLatitude = data['results'][0]['geometry']['location']['lat'];
        console.log("My longitude is: " + myLongitude + " and my latitude is: " + myLatitude)
        getOpendata();
      }
    })
  }

//////////////////NYC OPENDATA///////////////////

  var getOpendata = function () {
    var root = 'https://data.cityofnewyork.us/resource/57mv-nv28.json?$query=SELECT%20ofns_desc%20WHERE%20within_circle(lat_lon,%20'+myLatitude+',%20'+myLongitude+',%20200)%20AND%20cmplnt_fr_dt%20%3E=%20%272013-12-31T00:00:00%27';

    $.ajax({
      dataType: 'json',
      url: root,
      method: 'GET'
    }).then(function(data) {
            console.log(data)
        if (data[0] != null){
            sketchCalc(data);
        } else{
            // $(".response").remove();
            // $("#sketchypic").remove();
            // $(".giveDetails").remove();
            // $("#results").append("<p class='response'>Sorry, we couldn't find that location.</p><p class='response'>Are you sure you entered in a valid address in New York City?</p><p class='response'>Hint: Try the following format - <i>120th and Frederick Douglass, New York</i></p>");
            //  $('html,body').animate({
            //   scrollTop: $(".response").offset().top
            //  }, 1000);
            alert("Sorry! We didn't recognize that address. Try entering it in another format.")
            }
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
      // if(input[i]['ofns_desc'] === "SEX CRIMES"){
      //       rapes++
      //   }
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
  // console.log("total rapes: " + rapes)
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

  var sketchLevel = ((robberies*5) + (assaults*9) + (weapons*8) + (burglaries*7) - (thefts))

  console.log("Your sketch level is: " + sketchLevel)

  if(sketchLevel <= 300){
    $(".response").remove();
    // $("#sketchypic").remove();
    // $(".giveDetails").remove();
    // $("#results").append("<p class='response'>Your hood is safe.</p>");
    // $("#sketchZone").append("<img class='responsive-img' id='sketchypic' src='img/pleasantville.jpg'>");
    // $("#details").append('<ul class="giveDetails collapsible" data-collapsible="accordion"><li><div class="collapsible-header">Details</div><div class="collapsible-body"><p class="detailText">Robberies: '+robberies+'</p><p class="detailText">Sex Crimes: '+rapes+'</p><p class="detailText">Assaults: '+assaults+'</p><p class="detailText">Weapons Charges: '+weapons+'</p></div></li></ul>');
    // $('.collapsible').collapsible();
      // $("#results").append('<p class="response">Nope!</p>')
  }
  if(sketchLevel > 300 && sketchLevel <= 800){
    $(".response").remove();
    // $("#sketchypic").remove();
    // $(".giveDetails").remove();
    // $("#results").append("<p class='response'>Your hood is slightly sketchy.</p>");
    // $("#sketchZone").append("<img class='responsive-img' id='sketchypic' src='img/sketchypic.jpg'>");
    // $("#details").append('<ul class="giveDetails collapsible" data-collapsible="accordion"><li><div class="collapsible-header">Details</div><div class="collapsible-body"><p class="detailText">Robberies: '+robberies+'</p><p class="detailText">Sex Crimes: '+rapes+'</p><p class="detailText">Assaults: '+assaults+'</p><p class="detailText">Weapons Charges: '+weapons+'</p></div></li></ul>');
    // $('.collapsible').collapsible();
    // $("#results").append('<p class="response">Slightly.</p>')
  }
  if(sketchLevel > 800 && sketchLevel <= 1400){
    $(".response").remove();
    // $("#sketchypic").remove();
    // $(".giveDetails").remove();
    // $("#results").append("<p class='response'>Your hood is pretty sketchy.</p>");
    // $("#sketchZone").append("<img class='responsive-img' id='sketchypic' src='img/quitesketchy.jpg'>");
    // $("#details").append('<ul class="giveDetails collapsible" data-collapsible="accordion"><li><div class="collapsible-header">Details</div><div class="collapsible-body"><p class="detailText">Robberies: '+robberies+'</p><p class="detailText">Sex Crimes: '+rapes+'</p><p class="detailText">Assaults: '+assaults+'</p><p class="detailText">Weapons Charges: '+weapons+'</p></div></li></ul>');
    // $('.collapsible').collapsible();
    // $("#results").append('<p class="response">Yes.</p>')
  }
  if(sketchLevel > 1500){
    $(".response").remove();
    // $("#sketchypic").remove();
    // $(".giveDetails").remove();
    // $("#results").append("<p class='response'>GET OUTTA THERE</p>");
    // $("#sketchZone").append('<iframe id="sketchypic" src="//giphy.com/embed/1h6WhJFUF8B1u" width="480" height="274" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="http://giphy.com/gifs/christmas-scared-kids-1h6WhJFUF8B1u"></a></p>');
    // $("#details").append('<ul class="giveDetails collapsible" data-collapsible="accordion"><li><div class="collapsible-header">Details</div><div class="collapsible-body"><p class="detailText">Robberies: '+robberies+'</p><p class="detailText">Sex Crimes: '+rapes+'</p><p class="detailText">Assaults: '+assaults+'</p><p class="detailText">Weapons Charges: '+weapons+'</p></div></li></ul>');
    // $('.collapsible').collapsible();
    // $("#results").append('<p class="response">Run.</p>')
  }
 loadScreen(sketchLevel, robberies, assaults, burglaries, thefts, weapons);
}



});



