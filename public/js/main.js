$(document).ready(function() {
$('#display').fadeToggle(2000, 'linear');

////////////FIREBASE//////////////
var firebase = require("firebase");
var config = {
  apiKey: "AIzaSyDXdBaef4C8gaT-LqR7v7jsvgRwJbt7RAs",
  authDomain: "isitsketch.firebaseapp.com",
  databaseURL: "https://isitsketch.firebaseio.com",
  storageBucket: "isitsketch.appspot.com",
};
firebase.initializeApp(config);
var database = firebase.database();

function writeRankData(area, rank) {
  firebase.database().ref('sketchRanking/').push({
    area:area,
    rank:rank
  });
}

/////////////Variables//////////////
  var mapsToken = "AIzaSyDPMSlU4RW9QMz8ceTsBbBevwtLJvOLDAQ";
  var address;
  var myLongitude;
  var myLatitude;
  var userAddress = "10 E 21st St, New York NY";

////////////Form//////////////////
  $('.location-form').keypress(function(event){
    if (event.which === 13){
    $(this).find('input').attr('disabled','disabled');
      $(window).unbind("keypress");
      event.preventDefault();
      userAddress = $("#input1").val();
      address = userAddress.replace(/\s+/g, '+');
      getMaps(address);
      event.stopPropagation();
      return false;
    } else {
        return true;
      }
  });

///////////Loading Animation///////
function loadScreen(sketchLevel, robberies, assaults, burglaries, thefts, weapons, topFiveArr) {
  $('#load').fadeTo('slow', 1, function(){
    $('#mainTitle').fadeTo('slow',0);
    $('#instructions').fadeTo('slow',0);
    $('.location-form').fadeTo('slow',0);
    $('#load').delay(2200).fadeTo('slow',0, function() {
      $('.location-form').remove();
      setTimeout(function(){
        displayResults(sketchLevel, robberies, assaults, burglaries, thefts, weapons, topFiveArr);
      }, 2000);
    });
  });
}

/////////////Display Results/////////////////
var enabled = true;
function displayResults(sketchLevel, robberies, assaults, burglaries, thefts, weapons, topFiveArr) {
  if (enabled){
  $('#newResults').append('<h4 id="feedback" style="color:white;text-align:center;">' + userAddress + '</h4>');
  $("<h2 id='result-level'>Sketch Level: <span class='redText'>"+ sketchLevel +"</span></h2>").appendTo("#newResults");
  $('<div id="indicator"><div id="bar"></div><div id="dial"></div></div>').appendTo("#newResults");
  $('#newResults').append('<p style="color:white;text-align:center;margin:0 auto;">Robberies: <span class="dataText">'+ robberies +'</span> Assaults: <span class="dataText">'+assaults+'</span> Burglaries: <span class="dataText">'+burglaries+'</span> Weapons: <span class="dataText">'+weapons+'</span> </p>');
  $('<a id="tryAgain" class="waves-effect waves-light btn" href="http://isitsketch.com">Enter a New Address</a>').appendTo("#newResults");
  $('<p id="explanation">These results are based on NYC\'s OpenData information platform. The crimes have been weighted to reflect their severity, and adjusted for population. Hence, more crimes does not necessarily mean a higher overall Sketch Level. The resulting Sketch Level ranges from 0 (very few serious crimes) to 2000+ (lots of dangerous crime activity).</p>').appendTo("#newResults");
  $('#newResults').append('<h4 id="topFive">Can you beat these scores?:</h4><ul id="topList"></ul>');
  for (i = 0; i < 5; i++){
    var currentTopArea = topFiveArr[i]['area'];
    var currentTopRank = topFiveArr[i]['rank'];
    $('#topList').append('<li style="color:white; font-size:1em;line-height:1">' + currentTopArea + ': ' +'<span id="rankText">' + currentTopRank + '</span>' +'</li>');
  }
  var audio = new Audio('sound/gunsound.mp3');
  audio.play();

  if(sketchLevel <= 500) {
    $('#dial').addClass('sketchlevel1');
  }
  if(sketchLevel > 500 && sketchLevel <= 1000) {
    $('#dial').addClass('sketchlevel2');
  }
  if(sketchLevel > 1000 && sketchLevel <= 1500){
    $('#dial').addClass('sketchlevel3');
  }
  if(sketchLevel > 1500 && sketchLevel <= 2000) {
    $('#dial').addClass('sketchlevel4');
  }
  if(sketchLevel > 2000) {
    $('#dial').addClass('sketchlevel5');
  }
  enabled = false;
}
}

///////////Maps/////////////////
  function getMaps(address){
      $.ajax({
      method: "GET",
      url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address +"&key="+mapsToken,
      success: function(data){
        myLongitude = data['results'][0]['geometry']['location']['lng'];
        myLatitude = data['results'][0]['geometry']['location']['lat'];
        // console.log("My longitude is: " + myLongitude + " and my latitude is: " + myLatitude);
        getOpendata();
      }
    });
  }

//////////////////NYC OPENDATA///////////////////
  var getOpendata = function () {
    var root = 'https://data.cityofnewyork.us/resource/57mv-nv28.json?$query=SELECT%20ofns_desc%20WHERE%20within_circle(lat_lon,%20'+myLatitude+',%20'+myLongitude+',%20200)%20AND%20cmplnt_fr_dt%20%3E=%20%272013-12-31T00:00:00%27';
    $.ajax({
      dataType: 'json',
      url: root,
      method: 'GET'
    }).then(function(data) {
        if (data[0] != null){
            sketchCalc(data);
        } else{
            alert("Sorry! We didn't recognize that address (New York City addresses only). Try entering it in another format, and be specific.");
            $('.location-form').find('input').prop('disabled', false);
            }
      });
  };

//////////////SKETCH CALCULATOR////////////////
function sketchCalc(input){
  var robberies = 0;
  var assaults = 0;
  var burglaries = 0;
  var thefts = 0;
  var weapons = 0;
    for(let i = 0; i < input.length; i++){
      if(input[i]['ofns_desc'] === "ROBBERY"){
            robberies++;
        }
      if(input[i]['ofns_desc'] === "FELONY ASSAULT"){
            assaults++;
        }
      if(input[i]['ofns_desc'] === "BURGLARY"){
            burglaries++;
        }
      if(input[i]['ofns_desc'] === "ASSAULT 3 & RELATED OFFENSES"){
            assaults++;
        }
      if(input[i]['ofns_desc'] === "PETIT LARCENY"){
            thefts++;
        }
      if(input[i]['ofns_desc'] === "GRAND LARCENY"){
            thefts++;
        }
      if(input[i]['ofns_desc'] === "DANGEROUS WEAPONS"){
            weapons++;
        }
    }
  console.log("total robberies: " + robberies);
  console.log("total assaults: " + assaults);
  console.log("total burglaries: " + burglaries);
  console.log("total thefts: " + thefts);
  console.log("total weapons: " + weapons);
    //Methodology:
    //Various offenses are weighted for sketchiness according to my completely arbitrary rating.
    //However, thefts are in fact negatively correlated with sketchiness.
    //The reason for this is that although theft is a crime, it tends to occur where
    //there are greater numbers of peopl (hence more chances to steal) and more stores to rob from.
    //The presence of stores to rob from is an indication of commerce, and hence,
    //police presence. Accordingly, despite the high number of thefts in Times Square,
    //one would be unlikely to say that it's sketchier than Bed-Stuy.
    var sketchLevel = ((robberies*5) + (assaults*9) + (weapons*8) + (burglaries*7) - (thefts));
    if (sketchLevel < 0) {
      sketchLevel = 0;
    }
    console.log("Your sketch level is: " + sketchLevel);
    writeRankData(userAddress,sketchLevel);
    var topFiveRef = firebase.database().ref('sketchRanking/').orderByChild('rank');
    var topFiveArr = [];
    var areaArr = [];
    var topFiveSketch = topFiveRef.on('value', function(snap){
      snap.forEach(function (childsnap){
        var currentArea = childsnap.val()['area'];
        if (areaArr.indexOf(currentArea) === -1){
           areaArr.push(currentArea);
           topFiveArr.unshift(childsnap.val());
         }
      });
     loadScreen(sketchLevel, robberies, assaults, burglaries, thefts, weapons, topFiveArr);
    });
 }
});



