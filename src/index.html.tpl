<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Fabulous Events</title>
    <!--<link rel="icon" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15/svgs/solid/rocket.svg">-->
    <link rel="icon" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15/svgs/solid/map-marked.svg"> 
</head>
<body>
    <div id="main-map"></div>

    <div class="side-panel">
        <div class="side-panel-text">
            <h1>Fabulous Events</h1>
        </div>
    </div>   

    <div class="events-caption">
        <div class="side-panel-info-title">
            <h5>Events Caption</h5>
        </div>
        <div class="side-panel-caption">
            <div class="side-panel-info">
                <i class="fa-solid fa-location-dot"></i>
                <p>Event in more than 3 days</p>
            </div>
            <div class="side-panel-info">
                <i class="fa-solid fa-location-dot"></i>
                <p>Event in 3 days or less</p>
            </div>           
            <div class="side-panel-info">
                <i class="fa-solid fa-location-dot"></i>
                <p>Event exceeded</p>
            </div>

        </div>
    </div>

    <button id="zoom">Zoom In</button>

    <div class="success-message hidden"></div>

    <div id="menu">
        <input id="dark-v10" class="menu-input" type="radio" name="rtoggle" value="dark" checked="checked">
        <label for="dark-v10">Dark</label>
        <input id="light-v10" class="menu-input" type="radio" name="rtoggle" value="light">
        <label for="light-v10">Light</label>
        <input id="satellite-v9" class="menu-input" type="radio" name="rtoggle" value="satellite">
        <label for="satellite-v9">Satellite</label>
        <input id="streets-v11" class="menu-input" type="radio" name="rtoggle" value="streets">
        <label for="streets-v11">Streets</label>
        <input id="outdoors-v11" class="menu-input" type="radio" name="rtoggle" value="outdoors">
        <label for="outdoors-v11">Outdoors</label>
    </div>

</body>
</html>