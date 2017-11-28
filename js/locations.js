var LVM = new LocationsViewModel();

function Listing(title, location, id) {
  self = this;
  self.title = title;
  self.location = location;
  self.id = id;

  self.openWindow = function() {
    populateInfoWindow(markers[this.id], largeInfowindow);
  }
}

//    {title: '',
//      position: {lat: }},
function LocationsViewModel() {
  self = this;

  // Non-editable data
  self.allLocations = [
    {title: 'Ann Arbor Community Center',
      position: {lat: 42.287327, lng: -83.748333}},
    {title: 'Ann Arbor Municipal Airport',
      position: {lat: 42.225074, lng: -83.745631}},
    {title: 'Arbor Hills',
      position: {lat: 42.257400, lng: -83.700265}},
    {title: 'Briarwood Mall',
      position: {lat: 42.240333, lng: -83.746670}},
    {title: "C.S. Mott Children's Hospital",
      position: {lat: 42.282004, lng: -83.727174}},
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
    {title: 'St Joseph Mercy Ann Arbor Health System',
      position: {lat: 42.265611, lng: -83.655850}},
    {title: 'University of Michigan',
      position: {lat: 42.278206, lng: -83.738247}},
    {title: 'University of Michigan Hospital',
      position: {lat: 42.284728, lng: -83.729318}},
    {title: 'VA Ann Arbor Healthcare System',
      position: {lat: 42.286433, lng: -83.715135}},
    {title: 'Washtenaw Community College',
      position: {lat: 42.263509, lng: -83.665652}}
  ];

  // Editable data
  self.currLocations = ko.observableArray([]);

  // Operations
  self.setLocations = function(array) {
    var temp = [];
    for (var i = 0; i < array.length; i++) {
      var item = array[i];
      temp.push( new Listing(item.title, item.position, i) );
    }
    this.currLocations(temp);
  }

  for (var i = 0; i < this.allLocations.length; i++) {
    var item = this.allLocations[i];
    this.currLocations.push( new Listing(item.title, item.position, i) );
  }
}


ko.applyBindings(LVM);
