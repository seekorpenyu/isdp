//Compass Sensor
// Check if DeviceOrientationEvent is supported
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(event) {
        var alpha = event.alpha; // Get the compass heading from the event

        // Rotate the needles
        var needle = document.querySelector('.needle');
        var secondaryNeedle = document.querySelector('.secondary-needle');
        needle.style.transform = 'rotate(' + alpha + 'deg)';
        secondaryNeedle.style.transform = 'rotate(' + (alpha + 180) + 'deg)';
        // Update rotation value on the page
        var rotationValue = document.getElementById('rotationValue');
        rotationValue.innerText = Math.round(alpha) + '°';
    });
} else {
    console.log("Device orientation not supported");
}

//Google map live location
let map;
let marker;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: { lat: 3.1390, lng: 101.6869 } // Default center (Kuala Lumpur, Malaysia)
    });

    if (navigator.geolocation) {
        // Get the initial location
        navigator.geolocation.getCurrentPosition(function (position) {
            updateLocation(position.coords.latitude, position.coords.longitude);
        }, function () {
            handleLocationError(true, map.getCenter());
        });

        // Watch for continuous updates
        navigator.geolocation.watchPosition(function (position) {
            updateLocation(position.coords.latitude, position.coords.longitude);
        }, function () {
            handleLocationError(true, map.getCenter());
        });
    } else {
        handleLocationError(false, map.getCenter());
    }
}

function updateLocation(latitude, longitude) {
    const userLocation = {
        lat: latitude,
        lng: longitude
    };

    // Center the map on the updated location
    map.setCenter(userLocation);

    // Remove the previous marker if it exists
    if (marker) {
        marker.setMap(null);
    }

    // Add a new marker for the updated location
    marker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'Your Location'
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    console.error(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

// Add webcam

async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const webcamVideo = document.getElementById('webcam');
        webcamVideo.srcObject = stream;
    } catch (error) {
        console.error('Error accessing webcam:', error);
    }
}

window.onload = startWebcam;

// Function to toggle section visibility
function toggleSection() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'block';
    });
}

// Function to remove an individual section
function removeSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.style.display = 'none';
}

// Add event listener to the toggle button
document.getElementById('toggleSectionButton').addEventListener('click', toggleSection);

// Add event listeners to the Remove buttons for each section
document.getElementById('removePowerInfo').addEventListener('click', () => removeSection('powerInfoSection'));
document.getElementById('removeBoatInfo').addEventListener('click', () => removeSection('boatInfoSection'));
document.getElementById('removeCompass').addEventListener('click', () => removeSection('compassSection'));
document.getElementById('removeMap').addEventListener('click', () => removeSection('mapSection'));
document.getElementById('removeWebcam').addEventListener('click', () => removeSection('webcamSection'));
document.getElementById('removeNotification').addEventListener('click', () => removeSection('notificationSection'));

// Function to move the toggle button
function moveToggleButton(direction) {
    const toggleButton = document.getElementById('toggleSectionButton');
    const style = toggleButton.style;
    
    switch (direction) {
        case 'top':
            style.top = '5px';
            style.right = '';
            style.bottom = '';
            style.left = '';
            break;
        case 'right':
            style.top = '5px';
            style.right = '5px';
            style.bottom = '';
            style.left = '';
            break;
        case 'bottom':
            style.top = '';
            style.right = '5px';
            style.bottom = '5px';
            style.left = '';
            break;
        case 'left':
            style.top = '5px';
            style.right = '';
            style.bottom = '';
            style.left = '5px';
            break;
    }
}

// Add event listeners for the control buttons
document.getElementById('moveTop').addEventListener('click', () => moveToggleButton('top'));
document.getElementById('moveRight').addEventListener('click', () => moveToggleButton('right'));
document.getElementById('moveBottom').addEventListener('click', () => moveToggleButton('bottom'));
document.getElementById('moveLeft').addEventListener('click', () => moveToggleButton('left'));

// JavaScript to toggle Auto Pilot and Cancel Auto Pilot


document.getElementById('autoPilot').addEventListener('click', function () {
    const autoPilotButton = document.getElementById('autoPilot');
    
    if (autoPilotButton.innerText === 'Auto Pilot') {
        autoPilotButton.innerText = 'Manual Pilot';
        autoPilotButton.classList.remove('btn-success');
        autoPilotButton.classList.add('btn-danger');
    } else {
        autoPilotButton.innerText = 'Auto Pilot';
        autoPilotButton.classList.remove('btn-danger');
        autoPilotButton.classList.add('btn-success');
    }
});

// JavaScript to automatically cancel Auto Pilot when a D-pad button is pressed
const dPadButtons = document.querySelectorAll('.d-pad-button');
dPadButtons.forEach(button => {
    button.addEventListener('click', function () {
        const autoPilotButton = document.getElementById('autoPilot');
        if (autoPilotButton.innerText === 'Manual Pilot') {
            autoPilotButton.innerText = 'Auto Pilot';
            autoPilotButton.classList.remove('btn-danger'); // Remove the danger class
            autoPilotButton.classList.add('btn-success'); // Add the success class (green)
        }
    });
});

function updateCurrentTime() {
    var paragraph = document.getElementById("current-time");
    var now = new Date();

    // Format the date
    var options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    var formattedDate = now.toLocaleDateString(undefined, options);

    // Format the time
    var formattedTime = now.toLocaleTimeString();

    // Display the formatted date and time
    paragraph.innerHTML = formattedDate + ', ' + formattedTime;
}

// Update the current time every second (1000 milliseconds)
setInterval(updateCurrentTime, 1000);


// Call `updateCurrentTime` initially to display the current time immediately
updateCurrentTime();

//Gauge Section here

function updateGauge() {
    const gaugeValue = Math.floor(Math.random() * 50); // Simulating speed in km/h
    const level = document.querySelector('.level');
    const valueDisplay = document.querySelector('.value');

    anime({
        targets: level,
        rotate: (gaugeValue / 50) * 180, // Rotating needle from 0 to 180 degrees
        easing: 'easeOutQuad',
    });

    valueDisplay.innerText = gaugeValue + ' km/h';
}

// Update the gauge every 2 seconds
setInterval(updateGauge, 2000);

// Initial update
updateGauge();

// Function to update power system information
function updatePowerInfo() {
    // Make an AJAX request to the Flask API endpoint
    fetch('http://172.18.62.146:5000/api/get_data')
        .then(response => response.json())
        .then(data => {
            // Update HTML elements with the received data
            document.getElementById('solar-voltage').innerText = data.solar_voltage;
            document.getElementById('battery-voltage').innerText = data.battery_voltage;
            document.getElementById('solar-current').innerText = data.solar_current;
            document.getElementById('battery-current').innerText = data.battery_current;
            document.getElementById('battery-percentage').innerText = data.battery_percentage;
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Update power system information every second
setInterval(updatePowerInfo, 3000);









