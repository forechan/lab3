<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Airports in U.S</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"/>
    <link href="https://fonts.googleapis.com/css?family=Titillium+Web" rel="stylesheet">
    <style>

        html, body, #map { width: 100%; height: 100%; margin: 0; background: #fff; }

        .legend {
            line-height: 16px;
            width: 140px;
            color: #333333;
            font-family: 'Titillium Web', cursive;
            padding: 6px 8px;
            background: white;
            background: rgba(255,255,255,0.5);
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            border-radius: 5px;
        }

        .legend i {
            width: 16px;
            height: 16px;
            float: left;
            margin-right: 8px;
            opacity: 0.9;
        }

        .legend img {
            width: 16px;
            height: 16px;
            margin-right: 3px;
            float: left;
        }

        .legend p {
            font-size: 16px;
            line-height: 18px;
            margin: 0;
        }

    </style>
    <script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-ajax/2.1.0/leaflet.ajax.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/chroma-js/1.3.4/chroma.min.js"></script>
</head>
<body>
<!-- Our web map and content will go here -->
<div id="map"></div>
<script>

    // 1. Create a map object.
    var mymap = L.map('map', {
        center: [39.63, -110.70],
        zoom: 4,
        maxZoom: 10,
        minZoom: 3,
        detectRetina: true});

    // 2. Add a base map.
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}').addTo(mymap);

    // 3. Add cell towers GeoJSON Data
    // Null variable that will hold cell tower data
    var cellTowers = null;


    // 4. build up a set of colors from colorbrewer's dark2 category
    var colors = chroma.scale('Dark2').mode('lch').colors(9);
    // 5. dynamically append style classes to this page. This style classes will be used for colorize the markers.
    for (i = 0; i < 9; i++) {
        $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
    }

    // Get GeoJSON and put on it on the map when it loads
    airports= L.geoJson.ajax("assets/airports.geojson", {
        // assign a function to the onEachFeature parameter of the cellTowers object.
        // Then each (point) feature will bind a popup window.
        // The content of the popup window is the value of `feature.properties.company`
        onEachFeature: function (feature, layer) {
                   layer.bindPopup(feature.properties.CNTL_TWR);
               },

               pointToLayer: function (feature, latlng) {
                   var id = 0;
                   if (feature.properties.CNTL_TWR == "Y") { id = 0; }
                   else { id = 1;} // "Airport has no Control Tower"
                   return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane marker-color-' + (id + 1).toString() })});
               },
               attribution: 'Cell Tower Data &copy; Map Cruzin | Oregon counties &copy; Oregon Explorer | Base Map &copy; CartoDB | Made By Bo Zhao'
           }).addTo(mymap);

    // 6. Set function for color ramp
    colors = chroma.scale('Blues').colors(5);

    function getColor(total) {
        var id = 0;
        if (total > 60) { id = 3; }
        else if (total > 30 && count <= 45) { id = 3; }
        else if (total > 15  && count <= 30 ) { id = 2; }
        else if (total > 0 &&  count <= 15) { id = 1; }
        else  { id = 0; }
        return colors[id];
    }


    // 7. Set style function that sets fill color.md property equal to cell tower density
    function style(feature) {
        return {
            fillColor: getColor(feature.properties.total),
            fillOpacity: 0.4,
            weight: 2,
            opacity: 1,
            color: '#b4b4b4',
            dashArray: '4'
        };
    }

    // 8. Add States layer in the US
    // create state variable, and assign null value
        L.geoJson.ajax("assets/us-states.geojson").addTo(mymap);
        L.geoJson.ajax("assets/counties.us-states", {
            style: style
        }).addTo(mymap);



    // 9. Create Leaflet Control Object for Legend
    var legend = L.control({position: 'bottomleft'});

    // 10. Function that runs when legend is added to map
    legend.onAdd = function () {

        // Create Div Element and Populate it with HTML
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML += '<b><h2>Total Number of Airports</h2></b><br />';
        div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>60+</p>';
        div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>30-45</p>';
        div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>15-30</p>';
        div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p>0-15</p>';
        div.innerHTML += '<hr><b><h2>Air Traffic Towers</h2><b><br />';
        div.innerHTML += '<i class="fa fa-plane marker-color-1"></i><p>Yes Control Tower</p>';
        div.innerHTML += '<i class="fa fa-plane marker-color-2"></i><p>No Control Tower</p>';
        // Return the Legend div containing the HTML content
        return div;
    };

    // 11. Add a legend to map
    legend.addTo(mymap);

// 12. Add a scale bar to map
    L.control.scale({position: 'bottomleft'}).addTo(mymap);

</script>
</body>
</html>
