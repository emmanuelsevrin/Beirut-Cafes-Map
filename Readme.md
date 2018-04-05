# Best cafes of Beirut

This app lets you see the best cafes of Beirut and get access their names, locations, Zomato ratings and personnal comments from me

## How to open the page:
To open the page, simply open "web map.html" with a browser (e.g., Google Chrome, Safari,... )

## How to use the application:
The map shows you all the cool cafes of Beirut. You can filter them by keyword, and you can click on the cafes that interest you and see a description + photo of them

## App organization
The application has a few additional documents beyond "web map" and "read me" - here is what they're used for: 
1. "App.js" runs all the## How the application is organized: 
 javascript code - it's the core file that makes the app work
2. The "Images" folder is the repository for all images in the map (mostly, the images of the places)
3. The "knockout-3.4.2' is the link to the knockout library that helps the web page automatically update 

## Note on the Zomato API
THe Zomato ratings are pulled from the Zomato API, which has a limit of 1000 request per day. For this reason, the API request might not work if the volume of loads exceed this volume.   

## Sources and inspirations 
The css and html code from this app took some inspiration from an example single sidebar page available at this page
https://blackrockdigital.github.io/startbootstrap-simple-sidebar/#
Which is available under MIT licence

## Potential improvements
Multiple improvements can be considered on the application: 
- Cleaning up the CSS code
- Adding other cool cafes by opening app.js and adding more cafes directly in the Model
- Enabling people to select favorite shops 
- Building an interface for people to add cafes
- Color coding depending on how cool the cafes are
- Linking with instagram to load their latest photos
