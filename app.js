var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5
  });

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY})
  .addTo(myMap);

// Store our API endpoint inside url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(url, function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + feature.properties.mag + "</p>");
  }
  
  function pointToLayer(feature, coordinates) {
    return L.circleMarker(coordinates)
  }

  var geojsonMarkerOptions = function(feature, layer) {
    return {radius: getradius(feature.properties.mag),
    fillColor: getColor(feature.properties.mag),
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8}
  }

  L.geoJSON(earthquakeData, {
    pointToLayer: pointToLayer,
    style: geojsonMarkerOptions,
    
    onEachFeature: onEachFeature
  }).addTo(myMap);
//   var coordArray = [];
//   function coordsToLatLng(feature) {[feature.geometry.coordinates], reverse = true}
//     coorArray = L.geoJSON(earthquakeData, {
//       coordsToLatLng: coordsToLatLng
//     });   
//   console.log(coordArray);

  function getColor(d) {
    return d > 9 ? '#FFEDA0' :
           d > 7 ? '#FED976' :
           d > 5 ? '#FD8D3C' :
           d > 3 ? '#756bb1' :
                   '#BD0026' ;
}
  function getradius(d) {
    return d *5
  }
}

var legend = L.control({position: 'bottomright'});
function getColor(d) {
  return d > 9 ? '#FFEDA0' :
         d > 7 ? '#FED976' :
         d > 5 ? '#FD8D3C' :
         d > 3 ? '#756bb1' :
                 '#BD0026' ;
}
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  categories = ['> 9','> 7','> 5','> 3','0'];

    for (var i = 0; i < categories.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(categories[i]) + '"></i> ' +
             (categories[i] ? categories[i] + '<br>' : '+');
    }

    return div;
  }    
legend.addTo(myMap);