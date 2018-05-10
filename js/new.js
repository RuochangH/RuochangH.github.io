//mapbox accessToken
mapboxgl.accessToken = 'pk.eyJ1IjoicnVvY2hhbmciLCJhIjoiY2plMGN5NmduNTBzMzJ3cXA4OHJqbTg1MCJ9.hVntg2f96UxD239bHHlQFw';

//Set the map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ruochang/cjgx7h9d8000b2so75lhsbpjh',
    center: [-75.163669,39.953432],
    zoom: 13
});
map.addControl(new mapboxgl.NavigationControl());



//Get and Plot Live and historical data
//Size and fill styling are based on bike and dock availability
var url = 'https://www.rideindego.com/stations/json/';
var histURL = 'https://raw.githubusercontent.com/RuochangH/Final_Huang-Ruochang/master/final.geojson';

var landingPage =function(){

// Get and plot historical data as icons
//later used to provide historical information on click
    $.ajax(histURL).done(function(data) {
      var parsedData = JSON.parse(data);
        //plot
        map.addSource('history',{type:'geojson',data:parsedData});
        map.addLayer({
          "id":"hist",
          "type":"symbol",
          "source":"history",
          "layout":{
            "icon-image":"bicycle-15"
          }
        });
    });


    //Create click Event
    map.on('click', 'hist', function (e) {
      map.flyTo({center: e.features[0].geometry.coordinates});
      var coordinates = e.features[0].geometry.coordinates.slice();
      //console.log(e.features[0].properties.monday);
        var div = window.document.createElement('div');
        div.innerHTML ='<h5 style="color:#535E80 text-align: center">Bike Station Hourly Net Changes</h5><svg/>';
                var values = e.features[0].properties;
                var data =[values.h0,values.h1,values.h2,values.h3,values.h4,
                values.h5,values.h6,values.h7,values.h8,values.h9,values.h10,
              values.h11,values.h12,values.h13,values.h14,values.h15,values.h16,
          values.h17,values.h18,values.h19,values.h20,values.h21,values.h22,values.h23];

                var margin = {top:20, right:30,bottom:20,left:30},
                    width = 340 - margin.left - margin.right,
                    height = 200 - margin.top - margin.bottom,
                    barHeight = height/data.length;

                    var y0 = Math.max(Math.abs(d3.min(data)), Math.abs(d3.max(data)));
                    var y = d3.scale.linear()
                      .domain([-y0, y0])
                      .range([height,0])
                      .nice();

                    var x = d3.scale.ordinal()
                      .domain(d3.range(data.length))
                      .rangeRoundBands([0, width], 0.2);

                    var svg = d3.select(div).select("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left");


                    var bar = svg.selectAll("g.bar")
                    .data(data)
                    .enter().append("g");

                    bar.append("rect")
                    .attr("class", function(d) { return d < 0 ? "bar negative" : "bar positive"; })
                    .attr("y", function(d) { return y(Math.max(0, d)); })
                    .attr("x", function(d, i) { return x(i); })
                    .attr("height", function(d) { return Math.abs(y(d) - y(0)); })
                    .attr("width", x.rangeBand());

                    svg.append("g")
                    .attr("class", "x axis")
                    .call(yAxis);

                    svg.append("g")
                    .attr("class", "y axis")
                    .append("line")
                    .attr("y1", y(0))
                    .attr("y2", y(0))
                    .attr("x1", 0)
                    .attr("x2", width);

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setDOMContent(div)
            .addTo(map);
    });



map.on('load', function () {
  //Get Live data
    window.setInterval(function() {
        map.getSource('liveBike').setData(url);
    }, 2000);

    map.addSource('liveBike', { type: 'geojson', data: url });


//Plot Live data REGULAR STYLE
//add filter function for later use

    map.addLayer({
        "id": "liveBike",
        "type": "circle",
        "source": "liveBike",
        "filter":["all",
          ['==','kioskPublicStatus','Active'],
        ['==','isVirtual',false],
      ['==','isVisible',false]],
        "paint": {
          "circle-stroke-width":1.5,
          "circle-stroke-color":'#535E80',
            "circle-radius": {
              "property":"totalDocks",
              "stops": [
           [0, 0],
           [5, 3],
           [10,6],
           [15, 12],
         [20,15],
       [25,18],
     [30,21]]
            },
          "circle-color":'#7EBFDC',
        "circle-opacity":{
          "property":"bikesAvailable",
          'stops':[
            [0,0],
            [10,1]
          ]
        }}
        //Put live data icon beneath historical data
    },'hist');

//Create live data HOVER STYLE
    map.addLayer({
        "id": "liveBike-Hover",
        "type": "circle",
        "source": "liveBike",
        "filter":
    ["==","kioskId",""],
        "paint": {
          "circle-stroke-width":2.5,
          "circle-stroke-color":'#535E80',
            "circle-radius": {
              "property":"totalDocks",
              "stops": [
           [0, 0],
           [5, 5],
           [10,8],
           [15, 14],
         [20,17],
       [25,20],
     [30,23]]
            },
          "circle-color":'#7EBFDC'
        },
        //put live data hover style beneath historical data
    },'hist');


//Hover Effect
    map.on('mouseenter', 'liveBike', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
        map.setFilter("liveBike-Hover",["==","kioskId",e.features[0].properties.kioskId]);
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = "<strong>"+e.features[0].properties.addressStreet + " Station</strong><br>"+
        e.features[0].properties.bikesAvailable +" Bikes Available<br>"+
        e.features[0].properties.docksAvailable +" Docks Available";

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        var station = map.queryRenderedFeatures(e.point, {
          layers: ['liveBike']
        });

          if (station.length > 0) {
            document.getElementById('pd').innerHTML = description;
          } else {
            document.getElementById('pd').innerHTML = '<p>Hover Over a Station for Detail!</p>';
          }

    });

    map.on('mouseleave', 'liveBike', function() {
        map.setFilter("liveBike-Hover",["==","kioskId",""]);
        map.getCanvas().style.cursor = '';
        //popup.remove();
    });

});
};

landingPage();


//Start to use the application; Set the Second Page
$('#s0').click(function(){
  $('.intro').hide();
  $('#process').show();

  $('#locate').click(function(){

    $('.legend1').hide();
    map.removeLayer('new');
    map.removeLayer('new-Hover');
    if(map.getLayer('nearest')){
    map.removeLayer('nearest');
    map.removeSource('coorr');}

    if(map.getLayer('balance')){
    map.removeLayer('balance');
    map.removeSource('coorr2');}

    if(map.getLayer('route')){
    map.removeLayer('route');
    map.removeSource('route');}

    if(map.getLayer('route2')){
    map.removeLayer('route2');
    map.removeSource('route2');}
  });

  $('#update').click(function(){
  map.removeLayer('liveBike');
  map.removeLayer('liveBike-Hover');});

  //Allow user to check selected types of availabilities without accessing there locations
  $('#viewAll').click(function(){
    if(map.getLayer('nearest')){
    map.removeLayer('nearest');
    map.removeSource('coorr');}

    if(map.getLayer('balance')){
    map.removeLayer('balance');
    map.removeSource('coorr2');}

    if(map.getLayer('route')){
    map.removeLayer('route');
    map.removeSource('route');}

    if(map.getLayer('route2')){
    map.removeLayer('route2');
    map.removeSource('route2');}
    $('.legend0').hide();
    $('.legend1').show();
    $('#routttt').hide();
    $('#alllll').show();
    $('#route').show();

  function readInput(){
    switch($('#purpose').find(":selected").text()){
      case 'Station Check': return 'totalDocks';
      case 'Rent':  return 'bikesAvailable';
      case 'Return': return 'docksAvailable';}
  }
  var availability = readInput();
  map.removeLayer('new');
  map.addLayer({
      "id": "new",
      "type": "circle",
      "source": "liveBike",
      "filter":["all",
        ['==','kioskPublicStatus','Active'],
      ['==','isVirtual',false],
    ['==','isVisible',false]],
      "paint": {
        "circle-stroke-width":1.5,
        "circle-stroke-color":'#535E80',
          "circle-color":
            ["interpolate",["linear"],
            ['get',availability],
              0, '#ece9e7',
           30,'#7981d0'],
        "circle-radius":12,
      "circle-opacity":0.7}
  },'hist');

  map.addLayer({
      "id": "new-Hover",
      "type": "circle",
      "source": "liveBike",
      "filter":["==","kioskId",""],
      "paint": {
        "circle-stroke-width":2,
        "circle-stroke-color":'#535E80',
          "circle-color":
            ["interpolate",["linear"],
            ['get',availability],
              0, '#ece9e7',
           30,'#7981d0'],
        "circle-radius":14}
  },'hist');

  map.on('mouseenter', 'new', function(e) {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = 'pointer';
      map.setFilter("new-Hover",["==","kioskId",e.features[0].properties.kioskId]);
      var coordinates2 = e.features[0].geometry.coordinates.slice();
      var description2 = "<strong>"+e.features[0].properties.addressStreet + " Station</strong><br>"+
      e.features[0].properties[availability] +" "+ availability;

      while (Math.abs(e.lngLat.lng - coordinates2[0]) > 180) {
          coordinates2[0] += e.lngLat.lng > coordinates2[0] ? 360 : -360;
      }
      var station0 = map.queryRenderedFeatures(e.point, {
        layers: ['new']
      });

        if (station0.length > 0) {
          document.getElementById('pd0').innerHTML = description2;
        } else {
          document.getElementById('pd0').innerHTML = '<p>Hover Over a Station for Detail!</p>';
        }

  });

  map.on('mouseleave', 'liveBike', function() {
      map.setFilter("new-Hover",["==","kioskId",""]);
      map.getCanvas().style.cursor = '';});

  //calculate available station according to user input

  //$(document).ready(function(){

  //})
    $.ajax({method: 'GET',url:url,}).done(function(data){
      var filteredFeatures = data.features.filter(function(feature){
        return feature.properties[availability]>1;
      });

      var filteredFeatureCollection = {
        "type":"FeatureCollection",
        "features":filteredFeatures
      };
      console.log(filteredFeatureCollection);
      map.getSource('liveBike').setData(filteredFeatureCollection);
    });
  });

    //Add geolocator
  var geolocate= new mapboxgl.GeolocateControl({
      positionOptions: {
          enableHighAccuracy: true
      },
      //trackUserLocation: true,
      showUserLocation:false
  });

  map.addControl(geolocate);
  //setTimeout(function() {
  //    $(".mapboxgl-ctrl-geolocate").click();
//  },5000);


var user=[0,0];
geolocate.on('geolocate', function(e){
//var userUpdate=[0,0];
  user[0]=e.coords.longitude;
  user[1]=e.coords.latitude;
//  console.log(user);

  var canvas = map.getCanvasContainer();

  var geojson = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": user
        }
    }]
};
map.addSource('point', {
    "type": "geojson",
    "data": geojson
});
map.addLayer({
        "id": "point",
        "type": "circle",
        "source": "point",
        "paint": {
            "circle-radius": 8,
            "circle-color": "#3887be"
        }
    });


  function onMove(e) {
    var coords = e.lngLat;

    // Set a UI indicator for dragging.
    canvas.style.cursor = 'grabbing';

    // Update the Point feature in `geojson` coordinates
    // and call setData to the source layer `point` on it.
    geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];

    map.getSource('point').setData(geojson);
}

function onUp(e) {
    var coords = e.lngLat;
    user[0]=coords.lng;
    user[1]=coords.lat;
    canvas.style.cursor = '';

    // Unbind mouse/touch events
    map.off('mousemove', onMove);
    map.off('touchmove', onMove);
}


    // When the cursor enters a feature in the point layer, prepare for dragging.
    map.on('mouseenter', 'point', function() {
        map.setPaintProperty('point', 'circle-color', '#3bb2d0');
        canvas.style.cursor = 'move';
    });

    map.on('mouseleave', 'point', function() {
        map.setPaintProperty('point', 'circle-color', '#3887be');
        canvas.style.cursor = '';
    });

    map.on('mousedown', 'point', function(e) {
        // Prevent the default map drag behavior.
        e.preventDefault();

        canvas.style.cursor = 'grab';

        map.on('mousemove', onMove);
        map.once('mouseup', onUp);
    });

    map.on('touchstart', 'point', function(e) {
        if (e.points.length !== 1) return;

        // Prevent the default map drag behavior.
        e.preventDefault();

        map.on('touchmove', onMove);
        map.once('touchend', onUp);
          });

          //Update Map view with filtered station availability according to user input
          /*
          $('#update').click(function(){

            map.removeLayer('liveBike');
            map.removeLayer('liveBike-Hover');
            $('.legend0').hide();
            $('.legend1').show();

          });
          */

          //read user input
          $('#findStation').click(function(){
            map.removeLayer('liveBike');
            map.removeLayer('liveBike-Hover');
            map.removeLayer('new');
            map.removeLayer('new-Hover');
            //map.addLayer('nearest');
            //map.addLayer('balance');

            if(map.getLayer('nearest')){
            map.removeLayer('nearest');
            map.removeSource('coorr');}

            if(map.getLayer('balance')){
            map.removeLayer('balance');
            map.removeSource('coorr2');}

            if(map.getLayer('route')){
            map.removeLayer('route');
            map.removeSource('route');}

            if(map.getLayer('route2')){
            map.removeLayer('route2');
            map.removeSource('route2');}

            $('.legend0').hide();
            $('.legend1').hide();
            $('#routttt').show();
            $('#alllll').hide();
            $('#route').show();



          function readInput(){
            switch($('#purpose').find(":selected").text()){
              case 'Station Check': return 'totalDocks';
              case 'Rent':  return 'bikesAvailable';
              case 'Return': return 'docksAvailable';}
          }
          var availability = readInput();

          //calculate available station according to user input


          //})
            $.ajax({method: 'GET',url:url,}).done(function(data){
              var filteredFeatures = data.features.filter(function(feature){
                return feature.properties[availability]>1;
              });


          //get raw coordinates for turf
              var forturf= _.map(filteredFeatures, function(feature){
                var a=feature.geometry.coordinates[1];
                var b=feature.geometry.coordinates[0];
                return turf.point([a,b]);});
              var selection=turf.featureCollection(forturf);
              //console.log(forturf);
              var foruser = [0,0];
              foruser[0]=user[1];
              foruser[1]=user[0];
              var target = turf.point(foruser);
              console.log(target);
              var nearest = turf.nearestPoint(target,selection);
              var coor = [nearest.geometry.coordinates[1],nearest.geometry.coordinates[0]];
              console.log(coor);

              var coorr =
               {
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": coor
                  }
              };

              map.addSource(
                'coorr',{
                'type':'geojson',
                'data':coorr
              });

              map.addLayer({
                'id': 'nearest',
                'type': 'circle',
                'source': 'coorr',
                  'paint': {
                    'circle-color': 'orange',
                    'circle-opacity': 0.8,
                    'circle-radius':12
                  }
                },'hist');

              //  map.getSource('nearest').setData(coorr);
              //console.log(nearest);

              //Find the neares station that needs rebalancing
              //Get the next hour
              var d = new Date();
              var hr= d.getHours()+1;

              $.ajax(histURL).done(function(data) {
                var parsedData = JSON.parse(data);
                var filteredFeatures2;

                var forhist = function(){
                  switch($('#purpose').find(":selected").text()){
                    case 'Station Check': filteredFeatures2= parsedData.features.filter(function(feature){
                      return feature.properties['h'+hr]>0.1 | feature.properties['h'+hr]<-0.1;}); break;
                      case 'Rent': filteredFeatures2= parsedData.features.filter(function(feature){
                        return feature.properties['h'+hr]>0.1;}); break;
                        case 'Return': filteredFeatures2= parsedData.features.filter(function(feature){
                          return feature.properties['h'+hr]<-0.1;}); break;
                  }
                };

                forhist();
                var forturf2= _.map(filteredFeatures2, function(feature){
                  var a=feature.geometry.coordinates[1];
                  var b=feature.geometry.coordinates[0];
                  return turf.point([a,b]);});
                var selection2=turf.featureCollection(forturf2);
                console.log(selection2);

                var balance = turf.nearestPoint(target,selection2);
                console.log(balance);
                var coor2 = [balance.geometry.coordinates[1],balance.geometry.coordinates[0]];
                console.log(coor2);

                var coorr2 =
                 {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": coor2
                    }
                };

                map.addSource(
                  'coorr2',{
                  'type':'geojson',
                  'data':coorr2
                });

                map.addLayer({
                  'id': 'balance',
                  'type': 'circle',
                  'source': 'coorr2',
                    'paint': {
                      'circle-color': 'green',
                      'circle-opacity': 0.8,
                      'circle-radius':12
                    }
                  },'hist');
                  console.log(user);
                  console.log(coor);
                  console.log(coor2);



                  var routeURL = 'https://api.mapbox.com/directions/v5/mapbox/walking/' +
                  user[0] + ',' + user[1] + ';' + coor[0] + ',' + coor[1] + '?geometries=polyline&access_token='+mapboxgl.accessToken;
                  console.log(routeURL);
                  var routeURL2 = 'https://api.mapbox.com/directions/v5/mapbox/walking/' +
                  user[0] + ',' + user[1] + ';' + coor2[0] + ',' + coor2[1] + '?geometries=polyline&access_token='+mapboxgl.accessToken;

                    $.ajax(routeURL).done(function(routes){
                          var routePoints = decode(routes.routes[0].geometry);
                                var revisedPoints = _.map(routePoints,function(point){
                                      return [point[1],point[0]];
                                        });
                                      var route = turf.lineString(revisedPoints);
                                      console.log(route);


                                        $.ajax(routeURL2).done(function(routes){
                                          var routePoints2 = decode(routes.routes[0].geometry);
                                          var revisedPoints2 = _.map(routePoints2,function(point){
                                            return [point[1],point[0]];
                                          });
                                          var route2 = turf.lineString(revisedPoints2);
                                          console.log(route2);

                                          $('#route').click(function(){
                                            $("#all").show;

                                            if(map.getLayer('route')){
                                            map.removeLayer('route');
                                            map.removeSource('route');}


                                              if(map.getLayer('route2')){
                                              map.removeLayer('route2');
                                              map.removeSource('route2');}


                                            map.addSource(
                                              'route',{
                                              'type':'geojson',
                                              'data':route
                                            });

                                            map.addLayer({
                                              "id": "route",
                                              "type": "line",
                                              "source": 'route',
                                              "layout": {
                                                "line-join": "round",
                                                "line-cap": "round"
                                              },
                                              "paint": {
                                                "line-color": "orange",
                                                "line-width": 4
                                              }
                                            });
                                            map.addSource(
                                              'route2',{
                                              'type':'geojson',
                                              'data':route2
                                            });

                                            map.addLayer({
                                              "id": "route2",
                                              "type": "line",
                                              "source": 'route2',
                                              "layout": {
                                                "line-join": "round",
                                                "line-cap": "round"
                                              },
                                              "paint": {
                                                "line-color": "green",
                                                "line-width": 4
                                              }
                                            });

                                        });


                                        });






              });






            });

          });
    });
});
});
