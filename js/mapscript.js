// Create a new blank array for all the listing markers.
var markers = [];
var largeInfowindow;
var map;


function initMap() {
  var locations = LVM.currLocations();

  // Show/Hide listings
  if (this.screen.width >= 480) {
    LVM.hideListings(false);
  }

  // Constructor created a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 42.270000, lng: -83.735000},
    zoom: 13,
    mapTypeControl: false
  });

  largeInfowindow = new google.maps.InfoWindow();
  // red - 0, green - 1, blue - 2, black - 3
  var selectedIcon = makeMarkerIcon(0);
  var defaultIcon = makeMarkerIcon(1);
  var hoverIcon = makeMarkerIcon(3);

  // The following group uses the location array to create an array of markers
  // on initialize.
  for (var i=0; i < locations.length; i++) {
    // Get position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;

    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      map: map,
      title: title,
      icon: defaultIcon,
      animation: google.maps.Animation.DROP,
      id: i
    });

    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(hoverIcon);
    });
    marker.addListener('mouseout', function() {
      if (this == largeInfowindow.marker) {
        this.setIcon(selectedIcon);
      } else {
        this.setIcon(defaultIcon);
      }
    });

    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
      map.setCenter(this.getPosition());
    });
  }

  fitBounds()
};


// This function takes in a COLOR, and then creates a new marker icon of that
// color. The icon will be 21 px wide by 34 high, have an origin of 0, 0 and
// be anchored at 10, 34).
function makeMarkerIcon(num) {
  var markerImage = new google.maps.MarkerImage(
    'img/marker' + num + '.png',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
};

function fitBounds(array = markers) {
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < array.length; i++) {
    // Extend the boundaries of the map for each marker.
    bounds.extend(array[i].position);
  }
  map.fitBounds(bounds);
};

function hideListings() {
  if (LVM.hideListings()) {
    LVM.hideListings(false);
  } else {
    LVM.hideListings(true);
  }
};


function unsetIcon(marker) {
  if(!marker) {return;}
  LVM.currLocations()[marker.id].toShine(false);
  marker.setIcon(makeMarkerIcon(1));
};

function setIcon(marker) {
  if(!marker) {return;}
  LVM.currLocations()[marker.id].toShine(true);
  marker.setIcon(makeMarkerIcon(0));

  // Hides the menu when a listing is selected
  if (this.screen.width < 480) {
    LVM.hideListings(true);
  }
};


// This function populates the infowindow when the marker is clicked. We'll
// only allow one infowindow which will open at the marker that is clicked,
// and populate based on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker == marker) {
    return;
  } else if (infowindow.marker) {
    // Unhighlight the previous listing
    unsetIcon(infowindow.marker);
  }
  infowindow.addContent = function(stuff) {
    infowindow.setContent(infowindow.getContent() + stuff);
  }

  // Highlight the current listing
  setIcon(marker);

  infowindow.marker = marker;
  var title = '<h2>' + marker.title + '</h2><br>';

  // Make sure the marker is cleared if the infowindow is closed.
  infowindow.addListener('closeclick', function() {
    // Unhighlight the listing
    unsetIcon(infowindow.marker);
    infowindow.marker = null;
  });

  var streetViewService = new google.maps.StreetViewService();
  var radius = 50;

  // In case the status is OK, which means the pano was found, compute the
  // position of the streetview image, then calculate the heading, then get a
  // panorama from that and set the options
  function getStreetView(data, status) {
    if (status == google.maps.StreetViewStatus.OK) {
      var loc = marker.position;
      var imgUrl = 'http://maps.googleapis.com/maps/api/streetview'+
        '?size=600x400&location='+loc.lat()+','+loc.lng();
      var panorama = '<img class="image" alt="'+marker.title+'" src="'+
        imgUrl+'" /><br>';

      /* ---------- NOTE ----------
       * I reused existing code to show an streetview image instead of a
       * panorama
       * ---------- NOTE ---------- */
      infowindow.setContent(title + panorama);
    } else {
      infowindow.setContent(title +
        '<div class="text">No Image Found</div><br>');
    }
  };
  wikiArtcl(marker.title, infowindow);

  // Use streetview service to get the closest streetview image within
  // 50 meters of the markers pposition.
  streetViewService.getPanoramaByLocation(
    marker.position, radius, getStreetView);
  // Open the infowindow on the correct marker.
  infowindow.open(map, marker);
};

// This function filters through the available listings based on an entered
// frase, and hides not needed markers and listings. In the frase is empty,
// all markers and listings are shown.
function searchLocations(str) {
  var input = str.toLowerCase();
  var locations = LVM.getLocations();
  var temp_array = []
  console.log('input: "' + input + '"');

  // Do nothing if input has not changed.
  if (LVM.searchInput() == str) { return; }

  // Body
  for (var i = 0; i < locations.length; i++) {
    var item = LVM.currLocations()[i];
    var marker = markers[i];
    // I chose to use `setMap()` instead of `setVisible()` because the
    // infowindow doesn't automatically hide in `setVisible()`.
    if (locations[i].title.toLowerCase().includes(input)) {
      item.toHide(false);
      marker.setVisible(true);
      temp_array.push(marker);
    } else {
      item.toHide(true);
      marker.setVisible(false);

      // Hide infowindow if marker is not shown
      if (largeInfowindow.marker == marker) {
        console.log("close infowindow");
        largeInfowindow.close();
        console.log(largeInfowindow);
      }
    }
  }

  // Closing
  if (temp_array.length > 0) { fitBounds(temp_array); }
  LVM.searchInput(str);
};


// When the map load fails
function errorMap() {
  map = document.getElementById('map');
  map.innerHTML = '<img alt="A globe." src="img/Globe.png" >\n' +
    '<p>There was an Error with Google Maps.</p>';
  console.log('There was an Error with Google Maps.');
};

// Get Request for Wikipedia Articles
function wikiArtcl(cityStr, infowindow) {
  var url = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
    cityStr + '&format=json&callback=WikiCallback';

  // Process the Responce
  $.ajax({
    url: url,
    dataType: 'jsonp',
    jsonp: 'callback',
    success: function( response ) {
      if(response[1].length <= 0) {
        infowindow.addContent('<div class="text">No Wikipedia Articles.' +
          '</div><br>');
        console.log('no: wikiStr');
        return;
      }

      // Variables
      var a = response[1][0];
      a = a.replace(new RegExp(' ', 'g'), '_');
      var web_url = 'http://en.wikipedia.org/wiki/' + a;
      console.log(response[1]);

      // Body
      infowindow.addContent('<br><h2>Wikipedia Articles:</h2>');
      infowindow.addContent('<a href="' + web_url + '" class="text">' + a +
        '</a><br>');

      // Closing
      console.log('success: wikiStr');
    },
    error: function( response ) {
      infowindow.addContent('<div class="text">Could not Find any Wikipedia' +
        ' Articles.</div><br>');
      console.log('error: wikiStr');
    }
  });
};
