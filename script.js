
    var markers = [];
    var titles = [];

    var map;
    var myParser;

    function initMap() {

      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: {lat: -23.54877954172624, lng: -46.646671793935184},
        mapTypeId: 'satellite',
        disableDefaultUI: true
      });
      // parse kml file
      myParser = new geoXML3.parser({
      	map: map,
        markerOptions: {
        label: "?"},
        processStyles: true,
        singleInfoWindow: true,
        zoom : false,
        createMarker: myCreateMarker
      });
      // create marker from kml
      var i = 0;
      function myCreateMarker(placemark) {
        console.log(i);
        console.log(placemark.name);        
        marker = myParser.createMarker(placemark);
        google.maps.event.addListener(marker, 'click', markerClickHandler.bind(undefined, placemark, marker));
        markers.push({
          "marker":   marker,
          "title": placemark.name
        });
        deriva.atomos.push({
          "title": placemark.name,
          "texts": []          
        });
        i++;
      };

      function markerClickHandler(placemark, marker) {
        console.log(placemark);
        deriva.open(placemark.name, marker)
        latlng = placemark.Point.coordinates[0];

        //map.panTo(latlng);
        offsetCenter(latlng, 100, -150);
      };

      function offsetCenter(latlng, offsetx, offsety) {
        // latlng is the apparent centre-point
        // offsetx is the distance you want that point to move to the right, in pixels
        // offsety is the distance you want that point to move upwards, in pixels
        // offset can be negative
        // offsetx and offsety are both optional
        var latlng = new google.maps.LatLng(latlng);
        console.log(latlng);

        var scale = Math.pow(2, map.getZoom());
        console.log("aqui");        
        var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(latlng);
        var pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0);

        var worldCoordinateNewCenter = new google.maps.Point(
            worldCoordinateCenter.x - pixelOffset.x,
            worldCoordinateCenter.y + pixelOffset.y
        );
        console.log("lá");
        var newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
        map.panTo(newCenter);
        //map.setCenter(newCenter);
      };

			myParser.parse('derivaz.kml');
		  console.log(myParser);

      map.setZoom(18);
    }    
    // content component
    var deriva = new Vue({
      el: '#contentWindow',
      data: {
        title: 'LINA BO.RD ZONAS AUTÔNOMAS',
        atomos: [],
        isSelected: false,
        curPlace: null,
        curText: [],
        input: ""
      },
      methods: {
        open: function(_title, marker){
          this.isSelected = true;
          this.curPlace = _title;          
        },
        post: function(_title){
          console.log(_title);
          for(a in this.atomos){
            if(this.atomos[a].title == _title){
              if(this.input != "escreva aqui")
                this.atomos[a].texts.push(this.input);

            }
          }
          this.input = "";
        },
        update: function (e) {
          this.input = e.target.value
        },
        noise: function(_t, _idx) {
          console.log(_t);
          for(a in this.atomos){
            if(this.atomos[a].title == this.curPlace){
              for(t in this.atomos[a].texts){
                if(this.atomos[a].texts[t] == _t)
                  this.atomos[a].texts[t] += "sim";
              }              
            }
          }
        }
      }
    });