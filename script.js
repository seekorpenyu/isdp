/* //Add webcam

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
*/

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

function mainButton(endpoint, data) {
    fetch('http://raspberrypi:400/' + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

// Event listener for the start/stop button
const startStopButton = document.getElementById('startStop');
let isStarting = false;

startStopButton.addEventListener('click', () => {
    isStarting = !isStarting;

    // Toggle text and styles based on the state
    if (isStarting) {
        startStopButton.innerText = '◻';
        startStopButton.classList.add('stop');
        mainButton('start_stop', { action: 'start' });
    } else {
        startStopButton.innerText = '▷';
        startStopButton.classList.remove('stop');
        mainButton('start_stop', { action: 'stop' });
    }
});

// JavaScript to toggle Auto Pilot and Cancel Auto Pilot
function sendCommand(endpoint, data) {
    fetch('http://raspberrypi:3000/' + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

const runStopButton = document.getElementById('runStop');
let isRunning = false;

runStopButton.addEventListener('click', () => {
    isRunning = !isRunning;

    // Toggle text and styles based on the state
    if (isRunning) {
        runStopButton.innerText = 'Motor OFF';
        runStopButton.classList.remove('btn-success');
        runStopButton.classList.add('btn-danger');
        sendCommand('run_stop', { action: 'run' }); // Call sendCommand with 'run' action
    } else {
        runStopButton.innerText = 'Motor ON';
        runStopButton.classList.remove('btn-danger');
        runStopButton.classList.add('btn-success');
        sendCommand('run_stop', { action: 'stop' }); // Call sendCommand with 'stop' action
    }
});


// Add event listener for the speed slider
const speedSlider = document.getElementById('speedSlider');
speedSlider.addEventListener('input', () => {
    let speed = 'medium';
    if (speedSlider.value == 1) {
        speed = 'low';
    } else if (speedSlider.value == 3) {
        speed = 'high';
    }
    sendCommand('speed', { speed: speed });
});

// Add event listeners for the control buttons
document.getElementById('moveTop').addEventListener('click', () => sendCommand('move', { direction: 'forward' }));
document.getElementById('moveRight').addEventListener('click', () => sendCommand('move', { direction: 'right' }));
document.getElementById('moveBottom').addEventListener('click', () => sendCommand('move', { direction: 'backward' }));
document.getElementById('moveLeft').addEventListener('click', () => sendCommand('move', { direction: 'left' }));

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
/*
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
*/

//Google map live location
let map;
let marker;
let prevMarker;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 20,
        center: { lat: 3.1390, lng: 101.6869 } // Default center (Kuala Lumpur, Malaysia)
    });

    // Call updateLocation every second
    setInterval(updateLocation, 1000);
}

function updateLocation() {
    fetch('http://raspberrypi:5000/location')
        .then(response => response.json())
        .then(data => {
            const userLocation = {
                lat: data.lat,
                lng: data.lon
            };

            // Center the map on the updated location
            map.setCenter(userLocation);

            // If there is a previous marker, change its color to grey
            if (prevMarker) {
                prevMarker.setIcon({
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 7,
                    fillColor: "#808080",
                    fillOpacity: 0.6,
                    strokeWeight: 0.4,
                    strokeColor: "#FFFFFF"
                });
            }

            // Add a new marker for the updated location
            marker = new google.maps.Marker({
                position: userLocation,
                map: map,
                title: 'Your Location',
            });

            // The current marker becomes the previous marker for the next update
            prevMarker = marker;
        })
        .catch(error => console.error('Error:', error));
}

//Compass Sensor
// Check if the DeviceOrientationEvent is not supported
if (window.DeviceOrientationEvent && navigator.geolocation) {
    window.addEventListener('deviceorientation', function (event) {
        var alpha = event.alpha; // Get the compass heading from the event

        // Rotate the needles
        var needle = document.querySelector('.needle');
        var secondaryNeedle = document.querySelector('.secondary-needle');
        needle.style.transform = 'rotate(' + (360 - alpha) + 'deg)';
        secondaryNeedle.style.transform = 'rotate(' + (180 - alpha) + 'deg)';

        // Update rotation value on the page
        var rotationValue = document.getElementById('rotationValue');
        var displayedValue = Math.round(360 - alpha) % 360; // Use modulo to ensure the range is 0 to 359
        rotationValue.innerText = displayedValue + '°';
    });

    // Get the device's current location
    navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        console.log("Latitude: " + latitude + "°, Longitude: " + longitude + "°");
    });
} else {
    console.log("Device orientation or Geolocation not supported");
}

// Fetch magnetometer data from the server
function updateCompass() {
    fetch('http://raspberrypi:4000/9dof')
        .then(response => response.json())
        .then(data => {
            // Use magnetometer heading for rotation
            var magnetometerHeading = data.magnetometer.bearing;
            var needle = document.querySelector('.needle');
            var secondaryNeedle = document.querySelector('.secondary-needle');
            needle.style.transform = 'rotate(' + magnetometerHeading + 'deg)';
            secondaryNeedle.style.transform = 'rotate(' + (magnetometerHeading + 180) + 'deg)';

            // Update rotation value on the page
            var rotationValue = document.getElementById('rotationValue');
            rotationValue.innerText = Math.round(magnetometerHeading) + '°';
        })
        .catch(error => console.error('Error fetching compass data:', error))
        .finally(() => setTimeout(updateCompass, 300)); // Fetch data every second
}

// Start fetching data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCompass();
});

// Function to update power system information
function updateData() {
    // Make an AJAX request to the Flask API endpoint
    fetch('http://raspberrypi:2000/data')
        .then(response => response.json())
        .then(data => {
            // Update HTML elements with the received data
            if (data['INA219 Voltage']) document.getElementById('INA219_Voltage').innerText = 'Motor Voltage: ' + data['INA219 Voltage'];
            if (data['INA219 Current']) document.getElementById('INA219_Current').innerText = 'Motor Current: ' + data['INA219 Current'];
            if (data['INA219 Power']) document.getElementById('INA219_Power').innerText = 'Motor Power: ' + data['INA219 Power'];
            if (data['INA219 Accumulated Energy']) document.getElementById('INA219_Accumulated_Energy').innerText = 'Motor Energy Consumption: ' + data['INA219 Accumulated Energy'];
            if (data['Calculated Power (ACS712)']) document.getElementById('Calculated_Power_ACS712').innerText = 'RPi Power: ' + data['Calculated Power (ACS712)'];
            if (data['Accumulated Energy (ACS712)']) document.getElementById('Accumulated_Energy_ACS712').innerText = 'RPi Energy Consumption: ' + data['Accumulated Energy (ACS712)'];
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Update data every second
setInterval(updateData, 1000);


function updateCompassData() {
    fetch('http://raspberrypi:4000/9dof') // Changed the URL to relative path
        .then(response => response.json())
        .then(data => {
            console.log('Received data:', data);
            displayCompassData(data);
        })
        .catch(error => console.error('Error fetching compass data:', error))
        .finally(() => setTimeout(updateCompassData, 1000)); // Fetch data every second
}

function displayCompassData(data) {
    const speed = Math.sqrt(
        Math.pow(data.acceleration.x, 2) +
        Math.pow(data.acceleration.y, 2) +
        Math.pow(data.acceleration.z, 2)
    );
    document.getElementById('acceleration-speed').textContent = speed.toFixed(2);

    //    document.getElementById('gyroscope-x').textContent = data.gyroscope.x.toFixed(2);
    //    document.getElementById('gyroscope-y').textContent = data.gyroscope.y.toFixed(2);
    //    document.getElementById('gyroscope-z').textContent = data.gyroscope.z.toFixed(2);

    document.getElementById('magnetometer-bearing').textContent = data.magnetometer.bearing.toFixed(2);
}

// Start fetching data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCompassData();
});

function updateGauge(accelData) {
    const level = document.querySelector('.level');
    const valueDisplay = document.querySelector('.value');

    // Calculate the rotation angle based on the speed_m_s
    const rotationAngle = (accelData.speed_m_s / 10) * 180; // Adjust as needed

    level.style.transform = `rotate(${rotationAngle}deg)`;

    // Display the speed_m_s with two decimal places
    valueDisplay.innerText = `${accelData.speed_m_s.toFixed(2)} m/s`;
}

function fetchAccelerometerData() {
    // Fetch accelerometer data from the server
    fetch('http://raspberrypi:4000/9dof') // Changed the URL to relative path
        .then(response => response.json())
        .then(data => {
            // Update the gauge with the fetched accelerometer data
            updateGauge(data.acceleration);
        })
        .catch(error => console.error('Error fetching accelerometer data:', error))
        .finally(() => setTimeout(fetchAccelerometerData, 1000)); // Fetch data every 2 seconds
}

// Start fetching data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchAccelerometerData();
});
//new ip
document.getElementById('changeStreamForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var newIP = document.getElementById('newIP').value;

    fetch('/change_stream', {
        method: 'POST',
        body: 'new_ip=' + encodeURIComponent(newIP),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response => {
        if (response.ok) {
            alert('Stream source changed successfully');
        } else {
            alert('Failed to change stream source');
        }
    });
});

function updateDistance(distance) {
    document.getElementById('distance-value').textContent = distance.toFixed(2);  // Display distance with two decimal places
}

function fetchGPSData() {
    fetch('http://raspberrypi:5000/distance')  // Replace with your server address
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error fetching GPS data:', data.error);
            } else {
                updateDistance(data.distance);  // Update the distance
            }
        })
        .catch(error => console.error('Error fetching GPS data:', error))
        .finally(() => setTimeout(fetchGPSData, 1000));  // Fetch data every 1 second
}

// Start fetching GPS data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchGPSData();
});

let previousDuration = '00:00:00';

function updateDuration() {
    fetch('http://raspberrypi:5000/duration')
        .then(response => response.json())
        .then(data => {
            console.log('Received duration:', data.duration);
            displayDuration(data.duration);
        })
        .catch(error => console.error('Error fetching duration:', error))
        .finally(() => setTimeout(updateDuration, 1000)); // Fetch data every second
}

function displayDuration(duration) {
    const formattedDuration = formatDuration(duration);
    document.getElementById('duration').textContent = formattedDuration;
}

function formatDuration(duration) {
    if (isNaN(duration)) {
        return document.getElementById('duration').textContent;
    }
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

function pad(num) {
    return (num < 10) ? '0' + num : num;
}

// Start fetching data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateDuration();
});

function fetchTemperature() {
    fetch('http://raspberrypi:1000/temperature')
        .then(response => response.json())
        .then(data => {
            console.log('Received temperature data:', data);
            displayTemperature(data);
        })
        .catch(error => console.error('Error fetching temperature:', error))
        .finally(() => setTimeout(fetchTemperature, 1000)); // Fetch data every 1 seconds
}

function displayTemperature(data) {
    const temperatureDiv = document.getElementById('temperature');

    temperatureDiv.innerHTML = `
        <p><b>RPi Temperature:</b></p>
        <p>CPU: ${data.cpu.toFixed(2)}°C</p>
        <p>GPU: ${data.gpu.toFixed(2)}°C</p>
    `;
}

// Start fetching data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchTemperature();
});

function updateBoatAnimation(data) {
    // Get gyroscope readings for yaw, roll, and pitch
    const yaw = -data.gyroscope.x.toFixed(2);  // Yaw represents left/right movement
    const roll = -data.gyroscope.y.toFixed(2); // Roll represents tilt from left to right
    const pitch = -data.gyroscope.z.toFixed(2); // Pitch represents tilt from front to back

    // Calculate the radius of the boat
    const radius = 25; // Adjust as needed

    // Calculate the rotation angles for x, y, and z axes
    const Yaw = yaw * (radius / 90); // Divide by 90 as maximum yaw is 90 degrees
    const Roll = roll * (radius / 50); // Divide by 90 as maximum roll is 90 degrees
    const Pitch = pitch * (radius / 50); // Divide by 90 as maximum pitch is 90 degrees

    // Apply transformations to the boat based on gyroscope readings
    const boatElement = document.getElementById('boat');
    boatElement.style.transform = `
        rotateX(${Pitch}deg) 
        rotateY(${Roll}deg) 
        rotateZ(${Yaw}deg) 
    `;

    // Update console for debugging
    console.log('Yaw:', yaw, 'Roll:', roll, 'Pitch:', pitch);
}

function fetchGyroData() {
    fetch('http://raspberrypi:4000/9dof') // Changed the URL to relative path
        .then(response => response.json())
        .then(data => {
            console.log('Received data:', data);
            updateBoatAnimation(data);
        })
        .catch(error => console.error('Error fetching gyroscope data:', error))
        .finally(() => setTimeout(fetchGyroData, 300)); // Fetch data every 0.5 seconds
}

// Start fetching data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchGyroData();
});

function updateImageCount() {
    fetch('http://raspberrypi:500/image')
        .then(response => response.json())
        .then(data => {
            console.log('Received data:', data);
            displayImageCount(data);
            document.getElementById('image-counts').style.display = 'block'; // Make image counts visible
        })
        .catch(error => console.error('Error fetching image count:', error))
        .finally(() => setTimeout(updateImageCount, 500)); // Fetch data every 0.5 seconds
}

function displayImageCount(data) {
    document.getElementById('checkpoint-count').textContent = data.checkpoint;
    document.getElementById('checkpoint2-count').textContent = data.checkpoint2;
    document.getElementById('obstacle-count').textContent = data.obstacle;
}

function downloadImages() {
    // Open MySQL and trigger download process
    window.open('http://raspberrypi:520/download_table', '_blank');
}

// Start fetching data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateImageCount();
});

