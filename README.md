# Local Events

# Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Project](#project)
* [Features](#features)

# General Info
Single page web application with fetch from Mapbox API that allows the user to generate new local events (parties, concerts, markets, etc). 
It occupies the entire screen and has pannel to the right of the map that constains a form to create new Events. 
Project developed in Javascript OOP and styled with CSS. Dev environment: Docker and Lando.

# Technologies
Project created with:
* HTML
* CSS
* Javascript
* Webpack
* Docker
* Lando

# Project
### Form:
This form is used to create local events according to the following specifications:
* Event title
* Event description
* Start and end dates 
* Geographic coordinates

### Markers:
The pin of the event is different depending on the date:
* Green: Event in more than 3 days, 
* Orange: Event in 3 days or less,
* Red: Event exceeded.

### Buttons / Controls:
* An update information button in the form of a Mapbox custom control will be available at the left of the map.
* Zoom in and zoom out buttons avaulable at the bottom right of the map
* Search bar added to the top right to search places by address, city or country

### Data storage:
The data will be saved in the Local Storage. When starting the application the already saved data should appear on the map.

### Popups:
In the Popup, in addition to other information, a message should be displayed depending on the date of the event:
*Event in more than 3 days: "Attention, this event starts in x days, x hours and x minutes!",
*Event in 3 days or less: “Attention, this event starts in x days, x hours and x minutes!”,
*Event already started but not finished: “Attention, this event ends in x days, x hours and x minutes!”,
*Event expired: “What a pity! You missed this event!”.

## Features 
* When clicking on the map, the <input> of the coordinates are fed
* Events are displayed on the map in the form of Markers
* When hovering the mouse over a Marker we see the title and the dates of the event
* A Popup linked to each Marker displays all the information about the event
* All Local Events are stored into Local Storage
