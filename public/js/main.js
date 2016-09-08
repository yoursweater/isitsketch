  function geocodeAddress(geocoder) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        console.log(results);
        console.log(results[0].geometry.bounds.H.H);//extracts latitude
        console.log(results[0].geometry.bounds.j.H);//extracts longitude
        var lat = results[0].geometry.bounds.H.H;
        var lng = results[0].geometry.bounds.j.H;

      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }



