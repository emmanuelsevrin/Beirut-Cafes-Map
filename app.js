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
}


var ViewModel = {

	//initializes the app
	init: function(){
		//PlacesList is the list of places to display in the view
		//fetches all the locations from the model
		this.getallPlaces();
		ko.applyBindings(ViewModel);
	},


	initMap: function(){

		//creates a new map and add all the locations
		View.newMap();
		View.addMarkers();

		//updates all infowindow with the Zomato Rating. Loads only when the google maps is on since the Infowindow are loaded then. That could be changed if connectivity was a big problem
		ViewModel.updateallinfowindow();
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

	//sorts PlacesList according to the keyword entered by the user
	sortPlaces: function(entry){
		
		//the value entered by the user in the filter field
		var filterString = $("#filter").val();

		//going through each item and removing them if they don't match the string
		for(k=0; k<View.placesList.length; k++) {
			if(!View.placesList[k].name().includes(filterString)){
				View.placesList[k].visible(false);
			}
			else{
				View.placesList[k].visible(true);	
			}
		}
	//update the markers according to the latest list of Places to display
	View.updateMap();	
	},

	//update a target infowindow with their zomato review
	updateInfowindowWithZomatoReview: function(infowindow, index){
		var myHeaders = new Headers({
			"user-key": Zomato_user_key
		})

		var local_zomato_id = Model.keyPlaces[index].zomato_id;
	
		fetch('https://developers.zomato.com/api/v2.1/restaurant?res_id=' + local_zomato_id, {headers: myHeaders})
  		.then(function(response) {
  			 	return response.json();
  			})	 	
  		.then(function(myJson){
  			 	var new_rating = myJson.user_rating.aggregate_rating;
  				//if closed, opens up the infowindow then uses jQuery to update it
  				var infowindowwasopen = false;

			  		if(infowindow.getMap()){
	  				  	 infowindowwasopen = true;      		
	  				}
  				
  				infowindow.open(View.map);

  				$(`.rating.${local_zomato_id}`).html(new_rating);
  		  
			  		if(!infowindowwasopen){
	  		  				infowindow.close();
	  				}
 		})
  		.catch(e => ViewModel.handleZomatoError(e));

	},

	//go through each infowindow and update it with the zomato review
	updateallinfowindow: function(){
		View.infoWindowList.forEach(function(infowindow, index){
			ViewModel.updateInfowindowWithZomatoReview(infowindow, index);
		});
	},

	ZomatoError: false,

	handleZomatoError: function(e){
		if(!ViewModel.ZomatoError){
			alert('Error message: There was an issue with the loading of the Zomato Review. However, you should still be able to use the rest of the app ' + e);
		};
		ViewModel.ZomatoError = true;
	}
}

var View = {
	//those three variables represent: 1) the map that will be displayed, 2) the list of markers, 3) the list of infowindows 
	map,
	placesList: [],
	markersList:[],
	infoWindowList:[],

	//create a new View.map centered on Beirut
	newMap: function (){
		View.map = new google.maps.Map(document.getElementById('map'), { 
			center: Model.centerofMap, 
			zoom: 13
		});
	},

	//create new markers and add them tothe Markerlist 
	addMarkers: function(){
		View.placesList.forEach(function(value){
			View.markersList.push(new View.mapMarker(value));
		});
	},


	//update map to only keep the markers and infowindows for items open
	updateMap: function(){
		View.placesList.forEach(function(place, index){
			if(!place.visible()){
				View.markersList[index].setMap(null);
				View.infoWindowList[index].close();
			}
			else{
				View.markersList[index].setMap(View.map);
			}
		})
	},

	//constructor for a new map marker
	mapMarker: function(value){

		var mylatlong = {lat: value.lat, lng: value.lng}

		var marker = new google.maps.Marker({
					position: mylatlong,
					map:View.map,
					title: value.name()
				});

		//creating the infowindow by pulling the infowindow text from the function below
		var infoWindow = new google.maps.InfoWindow({
	        content: View.Createdescription(value.name(), value.description, value.external_link, value.image, value.zomato_id),
	        maxWidth: 400
	    });

		//adding to the list of infowindows
	    View.infoWindowList.push(infoWindow);

	    //function that highlight the marker and opens the infowindow. Is activated either by clicking on the marker or on the list item
	    marker.highlightmarker =  function(){
	    	  marker.setAnimation(google.maps.Animation.BOUNCE);
	          setTimeout(function(){marker.setAnimation(null); }, 1400);

	          //go through each infowindow and close it before opening a new one 
	          View.infoWindowList.forEach(function(infowindow_inlist){
	          	infowindow_inlist.close();
	          })

	 		  infoWindow.open(View.map, marker);
	 	}

		marker.addListener('click', function() {
			  marker.highlightmarker();
	    });


		return marker
	},

	//creates a text description that can be inserted in the infowwindow
	Createdescription: function(title, content, external_link, image, zomato_id){
		html_string ='<div class="row">' +
		'<div flex=30% class="column"><img width="100" height="100" src="images/' + image + '.jpg">'+ '</div>' +
		'<div flex=60% class="column">' + 
		'<h1>' + title + '</h1>' + 
		'<div id="bodyContent">' + 
		content + 
		'</div>' + 
		'<p> <a href="'+ external_link + '">'+ external_link + '</a></p>' + 
 		`<p> Zomato Rating: <span class="rating ${zomato_id}">N/A</span></p>` + //the N/A will be updated if/ once we have loaded the zomato review 
 		'</div>' + 
 		'</div>'
 		
		return html_string
	},

}

ViewModel.init();

