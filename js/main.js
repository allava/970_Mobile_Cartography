//main.js initiates the map and runs the functionality of the map 

var map;
 window.onload = loadmap();
 
var currentTile = 'modern';
//define variables hold the path to each tile layer
var historicTileset = L.tileLayer ('https://{s}.tiles.mapbox.com/v3/carolinerose.71spds4i/{z}/{x}/{y}.png');
var modernTileset = L.tileLayer ('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png');


//var studentRoute = L.geoJson(route1);
 
//these objects will hold pairs of keys (name of the tile layer) and values (variable holding the path to the tile layer) 
 var baseMaps = {
    "Modern": modernTileset,
    "Historic": historicTileset
};

/*var overlayMaps = {
	//route is defined in a .js file within the data folder. 
    "Route": studentRoute
};*/
 


 function loadmap(){

 
  map = L.map('map', { zoomControl:true});
    // tiles can change once we know our basemap 
    L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> <a href="http://http://leafletjs.com"> Leaflet </a> Tiles <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      minzoom: 5,
    }).addTo(map);
    // initial zoom & set map coords, these will change 
    
    
 
  addTileToggle();
}



function addTileToggle() { //called at the end of loadmap function

//could not get the default layer control to work. Substituted my own using the toggleTiles function. 
//	L.control.layers(baseMaps, null, {position: 'bottomleft', collapsed: false}).addTo(map);
	
	document.getElementById("tileToggle").addEventListener("click", toggleTiles);
	
}
/* Toggles Tiles */
function toggleTiles(){
	if (currentTile == 'modern'){
		console.log("switch to historic basemap"); 
		//this just adds the historic basemap on top of the existing tiles
		historicTileset.addTo(map);
		//reset variable 
		currentTile = 'historic';
	}
	else if (currentTile == 'historic') {
		console.log("switch to modern basemap"); 
		//this removes the historic basemap tile layer 
		map.removeLayer (historicTileset);
		//reset variable 
		currentTile = 'modern';
	}
}


// sends to responsive.js this allows map elements to be responsive
setMap(map);


/* Loads Markers Into Map*/
addMarkers(map); //function defined in markers.js file

/* initial script */
$('.script').html(PointsofInterest[0].features[0].properties.Scripts);

/*Load Route Into Map*/ 
/*
route segments do not align well with site locations.
Also, please keep the site id and segment id consistent
*/
// the style of the highlighted route segment
var highlightStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.8
};

// all segments of the route
var routeLayer = L.geoJson(routes[0]);
routeLayer.addTo(map);
// hilighted segment
var highlightLayer;

// audio
var audioDesktop = document.getElementById("playerDesktop");
var audioMobile = document.getElementById("playerMobile");

$('#slideshowModal').on('closed', function () {
	
    highlightRoute();
    addScript();
    
    // start to play audio after 1 sec closing sliede show
	setTimeout(playAudio, 1000);
});

function highlightRoute()
{
    if(highlightLayer){
        map.removeLayer(highlightLayer);
    }
    // "siteID" is a variable declared in markers.js to keep track of which site they are working on
	if(siteID < 4){
		highlightLayer = L.geoJson(routes[0].features[siteID + 1], {style: highlightStyle});
		highlightLayer.addTo(map);
	}

	console.log(highlightLayer);
}

function addScript(){

	//console.log("siteID",siteID);
	for(var prop in PointsofInterest[0]){
		//console.log(PointsofInterest[0][prop]);
		for(var key in PointsofInterest[0][prop]){
			//console.log(PointsofInterest[0][prop][key]);
			for(var one in PointsofInterest[0][prop][key]){
			
				//console.log(PointsofInterest[0][prop][key][one].id);
				if(siteID === PointsofInterest[0][prop][key][one].id - 1){
					//console.log("X",PointsofInterest[0][prop][key][one].Scripts);
					if(siteID<4){
						$('.script').html(PointsofInterest[0][prop][key][one].Scripts)
					}
				}

			}
		}

	}
	// var scriptNum = siteID;

	// console.log("x",L.geoJson(routes[0].features[siteID + 1]));

	// $('.script').html();

}

function playAudio()
{	
    var winHeight = $(window).height();
    var winWidth = $(window).width();
    if(winWidth > midBreakPoint){
        audioDesktop.setAttribute('src', PointsofInterest[0].features[siteID+1].properties.audio);
        audioDesktop.play();
    }
    else{
        audioMobile.setAttribute('src', PointsofInterest[0].features[siteID+1].properties.audio);
        audioMobile.play(); 
    }
}
