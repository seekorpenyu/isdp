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
document.getElementById('removeNavInfo').addEventListener('click', () => removeSection('navInfoSection'));
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
        autoPilotButton.innerText = 'Cancel Auto Pilot';
        autoPilotButton.classList.remove('btn-success'); // Remove the success class
        autoPilotButton.classList.add('btn-danger'); // Add the danger class (red)
    } else {
        autoPilotButton.innerText = 'Auto Pilot';
        autoPilotButton.classList.remove('btn-danger'); // Remove the danger class
        autoPilotButton.classList.add('btn-success'); // Add the success class (green)
    }
});

// JavaScript to automatically cancel Auto Pilot when a D-pad button is pressed
const dPadButtons = document.querySelectorAll('.d-pad-button');
dPadButtons.forEach(button => {
    button.addEventListener('click', function () {
        const autoPilotButton = document.getElementById('autoPilot');
        if (autoPilotButton.innerText === 'Cancel Auto Pilot') {
            autoPilotButton.innerText = 'Auto Pilot';
            autoPilotButton.classList.remove('btn-danger'); // Remove the danger class
            autoPilotButton.classList.add('btn-success'); // Add the success class (green)
        }
    });
});





