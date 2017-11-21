// Create a new blank array for all the listing markers.
var markers = [];
var largeInfowindow;
var map;


function initMap() {
  var coord = {lat: 42.279594, lng: -83.732124};
  var listings = document.getElementById('listings');

  // Constructor created a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: coord,
    zoom: 13,
    mapTypeControl: false
  });

  var locations = getLocations();

  largeInfowindow = new google.maps.InfoWindow();
  var blackIcon = makeMarkerIcon(3);

  // The following group uses the location array to create an array of markers
  // on initialize.
  for (var i=0; i < locations.length; i++) {
    // Get position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;

    // Add a listing name to the list.
    listings.innerHTML += '<li id="li-' + i + '" class="text"' +
      ' onclick="openWindow(' + i + ')">' + title + '</li>';
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      map: map,
      title: title,
      icon: makeMarkerIcon(1),
      animation: google.maps.Animation.DROP,
      id: i
    });

    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(blackIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(makeMarkerIcon(1));
    });

    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
  }
}


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
}


function hideListings() {
  var list = document.getElementById('list');
  if (list.className) {
    list.className = '';
  } else {
    list.className = 'hidden';
  }
}


function openWindow(index) {
  populateInfoWindow(markers[index], largeInfowindow);
}


// This function populates the infowindow when the marker is clicked. We'll
// only allow one infowindow which will open at the marker that is clicked,
// and populate based on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker == marker) {
    return;
  } else if (infowindow.marker) {
    // Unhighlight the previous listing
    var item = document.getElementById('li-'+infowindow.marker.id);
    item.className = 'text';
  }

  // Highlight the current listing
  var item = document.getElementById('li-'+marker.id);
  item.className = 'text highlighted';

  infowindow.marker = marker;
  var title = '<div>' + marker.title + '</div><br>';

  // Make sure the marker is cleared if the infowindow is closed.
  infowindow.addListener('closeclick', function() {
    // Unhighlight the listing
    var item = document.getElementById('li-'+infowindow.marker.id);
    item.className = 'text';
    infowindow.marker = null;
  });

  var streetViewService = new google.maps.StreetViewService();
  var radius = 50;

  // In case the status is OK, which means the pano was found, compute the
  // position of the streetview image, then calculate the heading, then get a
  // panorama from that and set the options
  function getStreetView(data, status) {
    if (status == google.maps.StreetViewStatus.OK) {
      var nearStreetViewLocation = data.location.latLng;
      var heading = google.maps.geometry.spherical.computeHeading(
        nearStreetViewLocation, marker.position);
      infowindow.setContent(title + '<div id="pano"></div>');
      var panoramaOptions = {
        position: nearStreetViewLocation,
        pov: {
          heading: heading,
          pitch: 30
        }
      };
      var panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), panoramaOptions);
    } else {
      infowindow.setContent(title + '<div>No Street View Found</div>');
    }
  }

  // Use streetview service to get the closest streetview image within
  // 50 meters of the markers pposition.
  streetViewService.getPanoramaByLocation(
    marker.position, radius, getStreetView);
  // Open the infowindow on the correct marker.
  infowindow.open(map, marker);
}
