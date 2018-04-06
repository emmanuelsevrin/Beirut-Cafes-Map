//User Key to access Zomato
var Zomato_user_key = "77335f51de6d653ec3fc9a14b78c256b";


var Model = {

	//data for key places
	keyPlaces: [
	{
		name: 'Aaliya cafe, Gemmayze',
		lat: 33.8949747,
		lng: 35.5184084,
		description: 'Aaliyas cafe is perhaps one of the best cafes of Beirut. Quiet, full of lights and with a friendly staff, this is hands-on the place where I like to spend most of my working time in the city.',
		external_link: 'https://www.facebook.com/AaliyasBooks/',
		image:'aaliya',
		zomato_id: '18618953',
	},
	{
		name: 'Sip cafe, Gemmayze',
		lat: 33.8951613,
		lng: 35.5152216,
		description: 'Lots of light, and delicious cafe. What else?',
		external_link: 'http://travelingwiththyme.com/2018/02/sip-beirut-coffee-gemmayzeh/',
		image:'sip',
		zomato_id: '18595425',
	},
	{
		name: 'Urbanista cafe, Gemmayze',
		lat: 33.895041,
		lng: 35.513431,
		description: 'Good coffee, full of food options, and central in Beirut. It comes across as a bit touristy and is a bit expensive but its also a safe choice.',
		external_link: 'http://www.weare-urbanista.com/about-us/',
		image:'urbanista_gemmayze',
		zomato_id: '16501054',
	},
	{
		name: 'Urbanista cafe, Hamra',
		lat: 33.899099,
		lng: 35.483775,
		description: 'Good coffee and full of food options.',
		external_link: 'http://www.weare-urbanista.com/about-us/',
		image:'urbanista_hamra',
		zomato_id: '16501099',
	},
	{
		name: 'De Prague Bar, Hamra',
		lat: 33.896143,
		lng: 35.483587,
		description: 'The most stylish bar / restaurant of Beirut. Movie nights and good songs - the place to go in Beirut.',
		external_link: 'https://www.beirut.com/l/72',
		image:'deprague',
		zomato_id: '16501916',
	},
	{
		name: 'Starbucks coffee, Ashrafieh',
		lat: 33.887618,
		lng: 35.521087,
		description: 'Another staple of Beirut for work. Only grievance - they have terrible internet.',
		external_link: 'https://mena.starbucks.com/en',
		image:'starbucks',
		zomato_id: '16503534',
	},
	],
	//Location: center of Beirut
	centerofMap: {lat: 33.888630, lng: 35.495480},

	//a table that will be filled with the zomato rating for each item
	ZomatoRatings: []
};

var ViewModel = {

	//initializes the app
	init: function(){
		//PlacesList is the list of places to display in the view
		//fetches all the locations from the model
		this.getallPlaces();
		ko.applyBindings(ViewModel);
		ViewModel.hideselectionbar();
		ViewModel.initializeZomatoRatings();

		//updates all infowindow with the Zomato Rating. 
		Model.keyPlaces.forEach(function(place, index){
			ViewModel.updateZomatoReview(place.zomato_id);
		});
	},

	initMap: function(){

		//creates a new map and add all the locations
		View.newMap();
		View.addMarkers();
	},

	//constructor for places from the Model
	Place: function(place_data, index){
		this.name = ko.observable(place_data.name);
		this.lat = place_data.lat;
		this.lng = place_data.lng;
		this.description = place_data.description;
		this.external_link = place_data.external_link;
		this.image = place_data.image;
		this.zomato_id = place_data.zomato_id;
		this.visible = ko.observable(true);
		this.index = index;
		this.go_to_highlightmarker = function(){View.markersList[index].highlightmarker();};
	},

	//fetches all the locations from the model
	getallPlaces: function(){
		Model.keyPlaces.forEach(function(place_data, index){
			View.placesList.push(new ViewModel.Place(place_data, index));
		});
	},

	//the value entered in the filter field in the page
	filterString: ko.observable(""),

	//sorts PlacesList according to the keyword entered by the user
	sortPlaces: function(entry){
		
		//going through each item and removing them if they don't match the string
		for(k=0; k<View.placesList.length; k++) {
			if(!View.placesList[k].name().includes(ViewModel.filterString())){
				View.placesList[k].visible(false);
			}
			else{
				View.placesList[k].visible(true);	
			}
		}
	//update the markers according to the latest list of Places to display
	View.updateMap();	
	},

	//initialize the list of Zomato rating with "N/A"
	initializeZomatoRatings: function(){
		Model.keyPlaces.forEach(function(place,index){
			let local_zomato_id = place.zomato_id.toString();
			Model.ZomatoRatings[local_zomato_id] = "N/A";
		});
	},

	//update a target infowindow with their zomato review
	updateZomatoReview: function(zomato_id){
		var myHeaders = new Headers({
			"user-key": Zomato_user_key
		});

//		var local_zomato_id = Model.keyPlaces[index].zomato_id;
	
		fetch('https://developers.zomato.com/api/v2.1/restaurant?res_id=' + zomato_id, {headers: myHeaders})
  		.then(function(response) {
  			 	return response.json();
  			})	 	
  		.then(function(myJson){
  			 	var new_rating = myJson.user_rating.aggregate_rating;
	  			Model.ZomatoRatings[zomato_id] = new_rating;
 		})
  		.catch(e => ViewModel.handleZomatoError(e));

	},

	//a marker that indicates whether there has already been a zomato error happening (avoids the pop-up window to show up 6 times in case of an arror)
	ZomatoError: false,

	//sends a pop-up message if there is an error with the zomato API
	handleZomatoError: function(e){
		if(!ViewModel.ZomatoError){
			alert('Error message: There was an issue with the loading of the Zomato Review. However, you should still be able to use the rest of the app ' + e);
		}
    
		ViewModel.ZomatoError = true;
	},

	//sends a pop-up message if there is an error with the Google API
	handleGoogleError: function(){
		alert('Error message: There was an issue with the loading of Google Maps. ');
	},

	getZomatoRating(zomato_id){
		return Model.ZomatoRatings[zomato_id];
	},

	//set the function of the hamburger to let the menu toggle
	ToggleList: function(){
		toggled = (!ViewModel.toggled);
		$("#wrapper").toggleClass("toggled");//using jquery to modify the CSS, not sure whether it's doable with knockout
		google.maps.event.trigger(map, 'resize');
	},

	//automatically hide the selection bar when the size of the screen is too small
	hideselectionbar: function(){
		if(screen.width < 500){
			$("#wrapper").class("");
		}
	}
};

var View = {
	//those  variables represent: 1) the map that will be displayed, 2) the list of places, 3) the list of markers, 4) the infowindow 
	map,
	placesList:[],
	markersList:[],
	infoWindow: [],

	//create a new View.map centered on Beirut
	newMap: function (){
		View.map = new google.maps.Map(document.getElementById('map'), { 
			center: Model.centerofMap, 
			mapTypeControl: true,
			mapTypeControlOptions: {
              	style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              	position: google.maps.ControlPosition.TOP_CENTER
          },
		});

		//new infowindow
		View.infoWindow = new google.maps.InfoWindow({
	        content: "",
	        maxWidth: 450
	    });

		View.updatemapsize();
	},

//View.Createdescription(value.name(), value.description, value.external_link, value.image, value.zomato_id)

	//create new markers and add them tothe Markerlist 
	addMarkers: function(){
		View.placesList.forEach(function(value){
			View.markersList.push(new View.mapMarker(value));
		});
	},


	//update map to only keep the markers and infowindows for items open
	updateMap: function(){
		View.placesList.forEach(function(place, index){
			View.infoWindow.close();
			if(!place.visible()){
				View.markersList[index].setMap(null);
			}
			else{
				View.markersList[index].setMap(View.map);
			}
		});
	},

	//constructor for a new map marker
	mapMarker: function(value){

		var mylatlong = {lat: value.lat, lng: value.lng};

		var marker = new google.maps.Marker({
					position: mylatlong,
					map:View.map,
					title: value.name()
				});

	    //function that highlight the marker and opens the infowindow. Is activated either by clicking on the marker or on the list item
	    marker.highlightmarker =  function(){
	    	  marker.setAnimation(google.maps.Animation.BOUNCE);
	          setTimeout(function(){marker.setAnimation(null); }, 1400);
	          let local_html = View.Createdescription(value.name(), value.description, value.external_link, value.image, value.zomato_id);
			  View.infoWindow.setContent(local_html);
	 		  View.infoWindow.open(View.map, marker);
	 	};

		marker.addListener('click', function() {
			  marker.highlightmarker();
	    });

		return marker;
	},

	//update the level of zoom in the map when the size of the screen changes (to avoid the map being too far away on small screens) 
	updatemapsize: function(){
		View.map.setCenter(Model.centerofMap);
		if(screen.width < 500){
			View.map.setZoom(14);
		}
		else{
			View.map.setZoom(13);	
		}
	},

	//creates a text description that can be inserted in the infowwindow
	Createdescription: function(title, content, external_link, image, zomato_id){
		html_string ='<div class="row">' +
		'<div flex=30% class="column"><img width="100" height="100" src="images/' + image + '.jpg">'+ '</div>' +
		'<div flex=60% class="column">' + 
		'<h4>' + title + '</h4>' + 
		'<div id="bodyContent">' + 
		content + 
		'</div>' + 
		'<p> <a href="'+ external_link + '">'+ external_link + '</a></p>' + 
 		`<p> Zomato Rating: <span class="rating"> ${ViewModel.getZomatoRating(zomato_id)}</span></p>` + //the N/A will be updated if/ once we have loaded the zomato review 
 		'</div>' + 
 		'</div>';
 		
		return html_string;
	},

};

ViewModel.init();


