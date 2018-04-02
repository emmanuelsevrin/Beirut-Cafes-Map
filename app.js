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
		name: 'Martyr Square, Gemmayze',
		lat: 33.896391, 
		lng: 35.507169,
		description: 'Martyr Square is a place full of history in Beirut. Its name - Martyrs Square - comes in commemoration of the martyrs executed there under Ottoman rule. Moreover during the civil war it marked the demarcation line between East and West Beirut.',
		external_link: 'https://en.wikipedia.org/wiki/Martyrs%27_Square,_Beirut',
		image:'martyr_square',
		zomato_id: '18618953',
	},
	{
		name: 'Sip cafe, Gemmayze',
		lat: 33.8951613,
		lng: 35.5152216,
		description: 'Lots of light, and delicious cafe. What else?',
		external_link: 'http://travelingwiththyme.com/2018/02/sip-beirut-coffee-gemmayzeh/',
		image:'sip',
		zomato_id: '18618953',
	},
	{
		name: 'Urbanista cafe, Gemmayze',
		lat: 33.895041,
		lng: 35.513431,
		description: 'Good coffee, full of food options, and central in Beirut. It comes across as a bit touristy and is a bit expensive but its also a safe choice.',
		external_link: 'http://www.weare-urbanista.com/about-us/',
		image:'urbanista_gemmayze',
		zomato_id: '18618953',
	},
	{
		name: 'Urbanista cafe, Hamra',
		lat: 33.899099,
		lng: 35.483775,
		description: 'Good coffee and full of food options.',
		external_link: 'http://www.weare-urbanista.com/about-us/',
		image:'urbanista_hamra',
		zomato_id: '18618953',
	},
	{
		name: 'De Prague Bar, Hamra',
		lat: 33.896143,
		lng: 35.483587,
		description: 'The most stylish bar / restaurant of Beirut. Movie nights and good songs - the place to go in Beirut.',
		external_link: 'https://www.beirut.com/l/72',
		image:'deprague',
		zomato_id: '18618953',
	},
	{
		name: 'Starbucks coffee, Ashrafieh',
		lat: 33.887618,
		lng: 35.521087,
		description: 'Another staple of Beirut for work. Only grievance - they have terrible internet.',
		external_link: 'https://mena.starbucks.com/en',
		image:'starbucks',
		zomato_id: '18618953',
	},
	],
//Location: center of Beirut
	centerofMap: {lat: 33.888630, lng: 35.495480},
}




//GLobal variable to access all the markers
var markersList = []
 



var essai;

//var PlacesList;

var Place = function(place_data){
	this.name = ko.observable(place_data.name);
	this.lat = place_data.lat;
	this.lng = place_data.lng;
	this.description = place_data.description;
	this.external_link = place_data.external_link;
	this.image = place_data.image;
	this.zomato_id = place_data.zomato_id
}



var ViewModel = {

	init: function(){
		//PlacesList is the list of places to display in the view
		PlacesList = ko.observableArray([]);

		this.getallPlaces();

		View.newMap();
		View.addLocations();
	},

	//pushes all places from the Model to PlaceList
	getallPlaces: function(){
		
		PlacesList([]);

		Model.keyPlaces.forEach(function(place_data){
			self.PlacesList.push( new Place(place_data))
		});
	},

	//sorts PlacesList according to the keyword entered by the user
	sortPlaces: function(entry){
		
		this.getallPlaces();

		var filterString = $("#filter").val();

		for(k=0; k<PlacesList().length; k++) {
			if(!PlacesList()[k].name().includes(filterString)){
				PlacesList.splice(k, 1);
				k=k-1; // we need to reduce k by one because we've just removed one element from the table where we iterate
			}
		}

	//update the markers according to the latest list of Places to display
	View.addLocations();	
	},

	updateInfowindowWithZomatoReview: function(infowindow, index){
		var myHeaders = new Headers({
			"user-key": Zomato_user_key
		})

		let local_zomato_id = Model.keyPlaces[index].zomato_id;
	
		fetch('https://developers.zomato.com/api/v2.1/restaurant?res_id=' + local_zomato_id, {headers: myHeaders})
  		.then(function(response) {
  			  return response.json();
 		 })
  		.then(function(myJson) {
  		  //console.log(myJson); // in case we should look at the JSON
  		  console.log(myJson.user_rating.aggregate_rating);
  		  console.log(local_zomato_id);
  		  infowindow.open(View.map);      	
  		  $(`.rating.${local_zomato_id}`).html(myJson.user_rating.aggregate_rating);
  		  infowindow.close(View.map);
  		  //View.updateinfowindow_withRating(Place_ID, myJson.user_rating.aggregate_rating);
  		  //View.infoWindowList[Place_ID] // ViewModel.ZomatoReview(myJson.user_rating.aggregate_rating);
 		 });

	}


}

var View = {

	map,
	markersList:[],
	infoWindowList:[],

	//create a new View.map centered on Beirut
	newMap: function (){
		View.map = new google.maps.Map(document.getElementById('map'), { 
			center: Model.centerofMap, 
			zoom: 13
		});
	},

	addLocations: function(){
		
		markersList.forEach(function(marker){
			marker.setMap(null);
		});

		markersList = [];

		PlacesList().forEach(function(value){
			markersList.push(new mapMarker(value));
		});
	},



	//creates a text description that can be inserted in the marker
	Createdescription: function(title, content, external_link, image, zomato_id){
		html_string ='<div class="row">' +
		'<div flex=30% class="column"><img width="100" height="100" src="images/' + image + '.jpg">'+ '</div>' +
		'<div flex=60% class="column">' + 
		'<h1>' + title + '</h1>' + 
		'<div id="bodyContent">' + 
		content + 
		'</div>' + 
		'<p> <a href="'+ external_link + '">'+ external_link + '</a></p>' + 
 		`<p> Zomato Rating: <span class="rating ${zomato_id}"></span></p>` +  
 		'</div>' + 
 		'</div>'
 		
 		//ViewModel.getZomatoReview(title, zomato_id);
		return html_string
	},

	updateallinfowindow: function(){
		console.log('running all infowindow')
		View.infoWindowList.forEach(function(infowindow, index){
			console.log('running for ' + infowindow + index);
			ViewModel.updateInfowindowWithZomatoReview(infowindow, index);
		});
	}

	// updateinfowindow_withRating: function(place_ID, rating){
	// 	View.infoWindowList[place_ID].
	// }

}


var mapMarker = function(value){

	var mylatlong = {lat: value.lat, lng: value.lng}

	var marker = new google.maps.Marker({
				position: mylatlong,
				map:View.map,
				title: value.name()
			});

	var infoWindow = new google.maps.InfoWindow({
        content: View.Createdescription(value.name(), value.description, value.external_link, value.image, value.zomato_id),
        maxWidth: 400
    });

    View.infoWindowList.push(infoWindow);

	marker.addListener('click', function() {

          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){marker.setAnimation(null); }, 1400);

          //go through each infowindow and close it before opening a new one 
          View.infoWindowList.forEach(function(infowindow_inlist){
          	infowindow_inlist.close();
          })

 		  infoWindow.open(View.map, marker);      	
        });


	return marker
	}

ViewModel.init();

View.updateallinfowindow();

//mapMarker.prototype = Object.create(google.maps.Marker.prototype);

//var essai = new mapMarker({lat, });

//essai.setMap(View.map);

ko.applyBindings(ViewModel);

//

// var data = null;

// var xhr = new XMLHttpRequest();
// xhr.withCredentials = true;

// xhr.addEventListener("readystatechange", function () {
//   if (this.readyState === 4) {
//     console.log(this.responseText);
//   }
// });

// xhr.open("GET", "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=209094a629c7432e9e3c9e236c26a674");
// xhr.setRequestHeader("Cache-Control", "no-cache");
// xhr.setRequestHeader("Postman-Token", "7da2b02b-67a5-46db-a3d8-8ddc7953f106");

// xhr.send(data);
// xhr.send(data);




// var myHeaders = new Headers({
// Authorization: OAuth oauth_consumer_key="Yfb1tIAV7nXjXUkSJ01DXwbok",
// oauth_token="247827096-EmlltmQsI0R2D5F9BM68gKWZkJRUZcqfVfsNUs0K",
// oauth_signature_method="HMAC-SHA1",
// oauth_timestamp="1522576131",
// oauth_nonce="sM6tLUeUmFX",
// oauth_version="1.0",
// oauth_signature="ZtSv1jANmBwx6QZ9iM0lpzE0agQ%3D"
// });

// var ab = fetch('https://api.twitter.com/1.1/search/tweets.json?q=nasa&result_type=popular', {headers: myHeaders})
// .then(response => console.log(response))


// function locatePlaces(){

// 	var geocoder = new google.maps.Geocoder();

// 	//keyPlaces.forEach(function(){

// 		geocoder.geocode(
// 			{	address: 'Aaliya Books, Beirut, Lebanon'
// 		}, function(results, status){
// 			console.log(results);
// 			//if (status == google.maps.Geocoderstatus.OK){

// 			//}
// 			}

// 		);
// 	//});
//}


// Constructor creates a new View.map - only center and zoom are required.



