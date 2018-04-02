# Neighborhood Map project

This programme runs a small game simulate a challenging crossing of a road full of ladybugs

## How to run the game:
To run the game, simply download all the files and open index.html

## How to play the game:
1. First, you will be invited to select the character you would like to play by pressing the keyboard 1 to 4 
2. Then, you will enter the game itself. The rules are simple: 
	- You can move by pressing the 4 arrows of your keyboard; up, down, left, right 
	- The green area at the bottom of the space is safe. You character won't be in danger there
	- When you step into the road (the paved space), you will need to avoid the ladybugs that cross the street
	- If you hit a ladybug, you will restart in the green area and increase your death marker by one
	- You win by reaching the blue space at the very top. Try to reach it with as few death as possible!

## How the game is programmed: 
The game has a few key functions: 
1. The CSS folder  has all the CSS files (display code)
2. The Images folder is the repository for all images in the game (tiles, character, ladybugs)
3. The JS folder contains the javascript code of the application. It has three files: 
	- Engine provides the game loop functionality (the loop that updates entities and render). It also draws the initial game board on the screen, and then calls the update and render methods on your player and enemy objects (defined in your app.js).
	- App builds the enemy and player objects, and includes the functions that govern the interaction between them (e.g., collision, victory)
	- Resources is an image loading utility. It enables the image loading functionality

## Potential improvements
Multiple improvements can be considered on the application: 
- Adding a time limit
- Creating a smoother player selection screen where the player directly click on the character they want to select
- Creating a victory screen with additional information
