var allLocations = [
  {title: 'Ann Arbor Community Center',
    position: {lat: 42.287327, lng: -83.748333}},
  {title: 'Ann Arbor Municipal Airport',
    position: {lat: 42.225074, lng: -83.745631}},
  {title: 'Arbor Hills',
    position: {lat: 42.257400, lng: -83.700265}},
  {title: 'Briarwood Mall',
    position: {lat: 42.240333, lng: -83.746670}},
  {title: 'Gallup Park',
    position: {lat: 42.273001, lng: -83.691474}},
  {title: 'GQT Quality 16',
    position: {lat: 42.286761, lng: -83.804245}},
  {title: 'Jewish Community Center',
    position: {lat: 42.239603, lng: -83.722176}},
  {title: 'Lydia Mendelssohn Theatre',
    position: {lat: 42.279629, lng: -83.737530}},
  {title: 'Michigan Stadium',
    position: {lat: 42.265843, lng: -83.748702}},
  {title: 'Michigan Theater',
    position: {lat: 42.279522, lng: -83.741765}},
  {title: 'Plymouth Mall',
    position: {lat: 42.303611, lng: -83.705630}},
  {title: 'Rave Cinemas',
    position: {lat: 42.227623, lng: -83.681863}},
  {title: 'University of Michigan',
    position: {lat: 42.278206, lng: -83.738247}},
  {title: 'VA Ann Arbor Healthcare System',
    position: {lat: 42.286433, lng: -83.715135}},
  {title: 'Washtenaw Community College',
    position: {lat: 42.263509, lng: -83.665652}}
];

function Listing(title, id) {
  self = this;
  self.title = title;
  self.id = id;

  self.openWindow = function() {
    populateInfoWindow(markers[this.id], largeInfowindow);
  }
}

function LocationsViewModel() {
  self = this;

  // Non-editable data

  // Editable data
  self.currLocations = ko.observableArray([]);
  self.currMarkers = ko.observableArray([]);


  // Operations
  self.makeMarker = function(title, position, id) {
    // Variables
    // red - 0, green - 1, blue - 2, black - 3
    var defaltIcon = makeMarkerIcon(1);
    var hoverIcon = makeMarkerIcon(3);
    var selectIcon = makeMarkerIcon(0);

    var marker = new google.maps.Marker({
      position: position,
      map: map,
      title: title,
      icon: defaltIcon,
      animation: google.maps.Animation.DROP,
      id: id
    });

    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(hoverIcon);
    });
    marker.addListener('mouseout', function() {
      if (this == largeInfowindow.marker) {
        this.setIcon(selectIcon);
      } else {
        this.setIcon(defaltIcon);
      }
    });

    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
  }

  for (var i = 0; i < allLocations.length; i++) {
    var item = allLocations[i];
    this.currLocations.push( new Listing(item.title, i) );
    //this.currMarkers.push( this.makeMarker(item.title, item.position, i) );
  }
}


ko.applyBindings(new LocationsViewModel());
