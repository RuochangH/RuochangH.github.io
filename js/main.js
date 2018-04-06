/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [41.880684,-87.630630],
  zoom: 13
});

var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  minzoom:0,
	maxZoom: 19,
  opacity:0.65,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
}).addTo(map);


//provide data
var dataURL = "https://raw.githubusercontent.com/RuochangH/OST4GIS-Midterm/master/mapfinal.geojson";
var featureGroup;

//filter function for page one
function myFilter1 (feature) {
  if(feature.properties.Week===9 && feature.properties.Hour===1){return true;}
}

//define color for page one
function getColor1(d){
  return d> 200 ? '#355C7D':
         d> 120 ? '#6C5B7B':
         d> 80 ? '#C06C84':
         d> 40 ? '#F67280':
                 '#F8B195';
               }

//define cllor for page three
function getColor31(d){
  return d> 3000 ? '#355C7D':
         d> 535 ?  '#6C5B7B':
         d> 103 ?  '#C06C84':
         d> 22 ?   '#F67280':
                   '#F8B195';

}

function getColor32(d){
  return d> 43645 ?  '#355C7D':
         d> 24905 ?  '#6C5B7B':
         d> 14405 ?  '#C06C84':
         d> 10122 ?  '#F67280':
                     '#F8B195';
}

function getColor33(d){
  return d> 113250 ?  '#355C7D':
         d> 96379 ?  '#6C5B7B':
         d> 81064 ?  '#C06C84':
         d> 62776 ?  '#F67280':
                     '#F8B195';
}

function getColor34(d){
  return d> 26 ?  '#355C7D':
         d> 23 ?  '#6C5B7B':
         d> 19 ?  '#C06C84':
         d> 12 ?  '#F67280':
                  '#F8B195';
}

//color style for page five
function getColor5(d){
  return d>0.95 ? '#F67280':
         d>0.25 ? '#C06C84':
         d>-0.25 ? '#F8B195':
         d>-0.95 ? '#6C5B7B':
                   '#355C7D';
}
//add hover display for page one
var info1 = L.control();

info1.onAdd = function(map){
 this._div = L.DomUtil.create('div','info1');
 this.update();
 return this._div;
};

//$(".slide1").append($("<div class='info1'></div>"));

info1.update = function(props){
  this._div.innerHTML = '<h4>Station Overview</h4>' + (props ?
  '<b>' + props.name + '</b><br />' + props.total +' Weekly Departure' +
  '<br/>' + props.dpcapacity + ' Dock Capacity': 'Hover over a station');
};

var info3 = L.control();

info3.onAdd = function(map){
 this._div = L.DomUtil.create('div','info3');
 this.update();
 return this._div;
};

//add interaction with each feature for page one
   //highlight
function highlightFeature(e){
  var layer=e.target;
  layer.setStyle({
    radius:12,
    weight:3,
    color:'white',
    dashArray: '',
    fillOpacity:0.9
  });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
  info1.update(layer.feature.properties);
}

   //remove highlight
function resetHighlight(e){
  var layer=e.target;
  layer.setStyle({
  radius:10,
  weight: 1,
  opacity: 0.8,
  color:'white',
  dashArray: '3',
  fillOpacity:0.6
});
  info1.update();
}

  //click to zoom in
function zoomToFeature(e){
  map.setView(e.latlng,16);
}

  //incoorpearte each feature's interactions in one
function onEachFeature1 (feature,layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}

//add legend for page one
var legend1 = L.control({position:'bottomright'});
legend1.onAdd = function(map) {
  var div = L.DomUtil.create('div','infoLegend1'),
  grades = [0,40,80,120,200],
  label = [];
  for (var i = 0; i<grades.length; i++){
    div.innerHTML +=
    '<i style = "background:' + getColor1(grades[i]+1) + '"></i> '+
    grades[i] + (grades[i+1] ? '&ndash;' + grades[i+1] + '<br>' :'+');
  }
  return div;
};


//execute
$(document).ready(function(){
  $.ajax(dataURL).done(function(data) {

    var parsedData = JSON.parse(data);

//page one interaction
    $('#s').click(function (){
      if(featureGroup != undefined){
        map.removeLayer(featureGroup);
      }

      info1.addTo(map);
      legend1.addTo(map);

      //plot
      featureGroup = L.geoJson((parsedData),{
      filter:myFilter1,
      pointToLayer:function(feature, latlng){
        var MarkerOption = {
          radius: 10,
          fillColor:getColor1(feature.properties.total),
          weight: 1,
          opacity: 0.8,
          color:'white',
          dashArray: '3',
          fillOpacity:0.6
        };
        return L.circleMarker(latlng,MarkerOption);
      },
      onEachFeature: onEachFeature1
    }).addTo(map);

  });

//page 2 interaction
    $('#s1').click(function(){
      if(featureGroup != undefined){
        map.removeLayer(featureGroup);
      }

      //read user input
      var hour = Number($('#ahour').find(":selected").text());
      function date() {switch ($('#aweek').find(":selected").text()){
        case 'Weekday': return 9;
        case 'Weekend': return 13;}}
      var week = date();

      //Filter distplay according to using input
      var myFilter2 = function(feature){
        if(feature.properties.Week===week && feature.properties.Hour===hour){return true;}
      };

      //add interaction with each feature for page two
      function onEachFeature2 (feature,layer) {
        layer.on('click',function(event){
          layer.bindPopup("The current departure count is " + feature.properties.dept);
          map.setView(event.latlng,15);
        });
      }

      //plot
      featureGroup = L.geoJson(parsedData,{
        filter:myFilter2,
        pointToLayer:function(feature,latlng){
          var geojsonMarkerOptions = {
              radius: feature.properties.dept+1,
              fillColor: "#F67280",
              color: "#355C7D",
              weight: 1,
              opacity: 0.5,
              fillOpacity: 0.8
            };
            return L.circleMarker(latlng,geojsonMarkerOptions);
          },
          onEachFeature: onEachFeature2
        }).addTo(map);
      });

//page three interactions
    $('#s2').click(function(){
      if(featureGroup != undefined){
        map.removeLayer(featureGroup);
        $('.info3').hide();
        $('.infoLegend3').hide();
      }

      //add hover display for page three
      info3.update = function(props){
        function text() {switch ($('#apredictor').find(":selected").text()){
          case 'Employment Density': return props.empDen + ' Employment Density';
          case 'Population Density': return props.popDen + ' Population Density';
          case 'Median Household Income': return props.medHHInc + ' Median Household Income';
          case 'Transit Stations Nearby': return props.num_stat + ' Transit Stations Nearby';}}

        this._div.innerHTML = '<h4>Predictors</h4>' + (props ?
        '<b>' + props.name + '</b><br />' + props.total +' Weekly Departure' +
        '<br/>' + text(): 'Hover over a station');
      };

      info3.addTo(map);

      //add interaction with each feature for page three
         //highlight
      function highlightFeature3(e){
        var layer=e.target;
        layer.setStyle({
          weight:3,
          color:'white',
          dashArray: '',
          fillOpacity:0.9
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
            }
        info3.update(layer.feature.properties);
      }

         //remove highlight
      function resetHighlight3(e){
        var layer=e.target;
        layer.setStyle({
        weight: 1,
        opacity: 0.5,
        color:'white',
        dashArray: '3',
        fillOpacity:0.6
      });
        info3.update();
      }


        //incoorpearte each feature's interactions in one
      function onEachFeature3 (feature,layer) {
        layer.on({
          mouseover: highlightFeature3,
          mouseout: resetHighlight3,
          click: zoomToFeature
        });
      }

      //add legend for page three
      var legend3 = L.control({position:'bottomright'});
      legend3.onAdd = function(map) {
        var div =L.DomUtil.create('div','infoLegend3'),
            grades=[],
            label=[];
        switch($('#apredictor').find(":selected").text()){
          case 'Employment Density':
          grades = [0,22,103,535,3000];
              for(i = 0; i<grades.length; i++){
                div.innerHTML +=
                '<i style = "background:' + getColor31(grades[i]+1) + '"></i> '+
                grades[i] + (grades[i+1] ? '&ndash;' + grades[i+1] + '<br>' :'+');
              }
          return div;

          case  'Population Density':
          grades = [0,10122,14405,24906,43645];
              for(i = 0; i<grades.length; i++){
                div.innerHTML +=
                '<i style = "background:' + getColor32(grades[i]+1) + '"></i> '+
                grades[i] + (grades[i+1] ? '&ndash;' + grades[i+1] + '<br>' :'+');
              }
          return div;

          case  'Median Household Income':
          grades = [0,62776,81064,96379,113250];
              for(i = 0; i<grades.length; i++){
                div.innerHTML +=
                '<i style = "background:' + getColor33(grades[i]+1) + '"></i> '+
                grades[i] + (grades[i+1] ? '&ndash;' + grades[i+1] + '<br>' :'+');
              }
          return div;

          case  'Transit Stations Nearby':
          grades = [0,12,19,23,26];
              for(i = 0; i<grades.length; i++){
                div.innerHTML +=
                '<i style = "background:' + getColor34(grades[i]+1) + '"></i> '+
                grades[i] + (grades[i+1] ? '&ndash;' + grades[i+1] + '<br>' :'+');
              }
          return div;
        }
      };

      legend3.addTo(map);

      featureGroup = L.geoJson(parsedData,{
        filter:myFilter1,

        pointToLayer:function(feature,latlng){

          //customize style
          function style() {switch ($('#apredictor').find(":selected").text()){
            case 'Employment Density': return getColor31(feature.properties.empDen);
            case 'Population Density': return getColor32(feature.properties.popDen);
            case 'Median Household Income': return getColor33(feature.properties.medHHInc);
            case 'Transit Stations Nearby': return getColor34(feature.properties.num_stat);}}
          var geojsonMarkerOptions = {
              radius: feature.properties.total/22,
              fillColor: style(),
              color: "white",
              weight: 1,
              opacity: 0.5,
              fillOpacity: 0.6
            };
            return L.circleMarker(latlng,geojsonMarkerOptions);
          },
          onEachFeature: onEachFeature3
        }).addTo(map);
      });

//page four interactions
      $('#s3').click(function(){
        if(featureGroup != undefined){
          map.removeLayer(featureGroup);
        }

        //read user input
        var hour2 = Number($('#bhour').find(":selected").text());
        function date() {switch ($('#bweek').find(":selected").text()){
          case 'Weekday': return 9;
          case 'Weekend': return 13;}}
        var week2 = date();

        //Filter distplay according to using input
        var myFilter4 = function(feature){
          if(feature.properties.Week===week2 && feature.properties.Hour===hour2){return true;}
        };

        //add interaction with each feature for page two
        function onEachFeature4 (feature,layer) {
          layer.on('click',function(event){
            layer.bindPopup("The hourly departure projection of selected station rounds to " + Math.round(feature.properties.predict));
            map.setView(event.latlng,15);
          });
        }

        //plot
        featureGroup = L.geoJson(parsedData,{
          filter:myFilter4,
          pointToLayer:function(feature,latlng){
            var geojsonMarkerOptions = {
                radius: feature.properties.predict+1,
                fillColor: "#F67280",
                color: "#355C7D",
                weight: 1,
                opacity: 0.5,
                fillOpacity: 0.8
              };
              return L.circleMarker(latlng,geojsonMarkerOptions);
            },
            onEachFeature: onEachFeature4
          }).addTo(map);
        });

//page five interactions
        $('#s4').click(function(){
          if(featureGroup != undefined){
            map.removeLayer(featureGroup);
            $('.infoLegend5').hide();
          }

          //read user input
          var hour3 = Number($('#chour').find(":selected").text());
          function date() {switch ($('#cweek').find(":selected").text()){
            case 'Weekday': return 9;
            case 'Weekend': return 13;}}
          var week3 = date();

          //Filter distplay according to using input
          var myFilter5 = function(feature){
            if(feature.properties.Week===week3 && feature.properties.Hour===hour3){return true;}
          };

          //add interaction with each feature for page five
             //highlight
          function highlightFeature5(e){
            var layer=e.target;
            layer.setStyle({
              weight:3,
              color:'white',
              dashArray: '',
              fillOpacity:0.9
            });
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                  layer.bringToFront();
                }
          }

             //remove highlight
          function resetHighlight5(e){
            var layer=e.target;
            layer.setStyle({
            weight: 1,
            color:'white',
            dashArray: '3',
            fillOpacity:0.6,
            opacity:0.5
          });
          }

          //add interaction with each feature for page five
          function onEachFeature5 (feature,layer) {
            layer.on({
              mouseover: highlightFeature5,
              mouseout: resetHighlight5,
              click:zoomToFeature
            });
            //create comparison chart
            var div = $('<div class="popupGraph" style="width:300px; height:200px;"><svg/></div>')[0];
            var popup = L.popup().setContent(div);
            layer.bindPopup(popup);
            var values = feature.properties;
            var data = [{name:"Observed",value:values.dept},
                        {name:"Predicted", value:values.predict}];
            var margin = {top:20, right:20,bottom:20,left:20},
                width = 300 - margin.left - margin.right,
                height = 180 - margin.top - margin.bottom,
                barHeight = height/data.length;
            var x = d3.scale.linear()
            .domain([0,d3.max(data,function(d){return d.value;})]).range([0,width]);
            var xAxis = d3.svg.axis().scale(x).orient("bottom");

            var svg = d3.select(div).select("svg")
            .attr("width",width+margin.left+margin.right)
            .attr("height",height+margin.top+margin.bottom).append("g")
            .attr("transform","translate("+ margin.left + "," + margin.top +")").classed("chart",true);

            svg.append("g").attr("class","x axis").attr("transform","translate(0,"+height+")").call(xAxis);

            var bar = svg.selectAll("g.bar").data(data).enter().append("g")
            .attr("transform", function(d,i){return "translate(0," + i*barHeight+")";});

            bar.append("rect").attr("width",function(d){return x(d.value);})
            .attr("height",barHeight -1);

            bar.append("text").attr("x", function(d) { return x(d.value) - 3; })
            .attr("y", barHeight / 2).attr("dy", ".35em").text(function(d) { return d.name; });
          }


          //add legend for page five
          var legend5 = L.control({position:'bottomright'});
          legend5.onAdd = function(map) {
            var div =L.DomUtil.create('div','infoLegend5'),
                grades = [-1.5,-0.95,-0.25,0.25,0.95,1.5],
                label=[];
                  for(i = 0; i<grades.length-1; i++){
                    div.innerHTML +=
                    '<i style = "background:' + getColor5(grades[i+1]) + '"></i> '+
                    grades[i] + '&ndash;' + grades[i+1] + '<br>' ;
                  }
              return div;
          };
          legend5.addTo(map);


          //plot
          featureGroup = L.geoJson(parsedData,{
            filter:myFilter5,
            pointToLayer:function(feature,latlng){
              var geojsonMarkerOptions = {
                  radius: feature.properties.dept+1,
                  fillColor: getColor5(feature.properties.error),
                  color: "white",
                  weight: 1,
                  dashArray:'3',
                  opacity: 0.5,
                  fillOpacity: 0.6
                };
                return L.circleMarker(latlng,geojsonMarkerOptions);
              },
              onEachFeature: onEachFeature5
            }).addTo(map);
          });



//slideshow
      var slideNum =0;


//define slides contents
      var slideDisplay = function (num){
        switch(num){
          case 0:
          $('.prev').hide();
          $('.next').show();
          $('.slide1').show();
          $('.slide2').hide();
          $('.slide5').hide();
          map.removeLayer(featureGroup);
          break;

          case 1:
          $('.prev').show();
          $('.next').show();
          $('.slide1').hide();
          $('.slide2').show();
          $('.slide3').hide();
          $('.info1').hide();
          $('.infoLegend1').hide();
          $('.info3').hide();
          $('.infoLegend3').hide();
          map.removeLayer(featureGroup);
          break;

          case 2:
          $('.prev').show();
          $('.next').show();
          $('.slide2').hide();
          $('.slide3').show();
          $('.slide4').hide();
          map.removeLayer(featureGroup);
          break;

          case 3:
          $('.prev').show();
          $('.next').show();
          $('.slide3').hide();
          $('.slide4').show();
          $('.slide5').hide();
          $('.info3').hide();
          $('.infoLegend3').hide();
          $('.infoLegend5').hide();
          map.removeLayer(featureGroup);
          break;

          case 4:
          $('.prev').show();
          $('.next').hide();
          $('.slide1').hide();
          $('.slide4').hide();
          $('.slide5').show();
          map.removeLayer(featureGroup);
          break;
        }
      };

//add next interaction
      $('.next').click(function(){
        slideNum +=1;
        //if (slideNum>4) {slideNum = 0;}
        map.setView([41.880684,-87.630630],13);
        slideDisplay(slideNum);
      });

//add previous interaction
      $('.prev').click(function(){
          slideNum -=1;
          //if(slideNum <0){slideNum = 4;}
          map.setView([41.880684,-87.630630],13);
          slideDisplay(slideNum);
        });
    });
});
