from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import RPi.GPIO as GPIO

app = Flask(__name__, template_folder='', static_folder='')
CORS(app)  # Enable CORS for all routes

GPIO.setmode(GPIO.BCM)

# Motor setup (replace with your actual pin numbers)
in1 = 8
in2 = 7
en1 = 12
in3 = 17
in4 = 27
en2 = 25

GPIO.setup(in1, GPIO.OUT)
GPIO.setup(in2, GPIO.OUT)
GPIO.setup(en1, GPIO.OUT)
GPIO.setup(in3, GPIO.OUT)
GPIO.setup(in4, GPIO.OUT)
GPIO.setup(en2, GPIO.OUT)

p1 = GPIO.PWM(en1, 1000)
p2 = GPIO.PWM(en2, 1000)

p1.start(0)
p2.start(0)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/move', methods=['POST'])
def move():
    data = request.get_json()
    direction = data['direction']

    # Stop all motors initially
    GPIO.output(in1, GPIO.LOW)
    GPIO.output(in2, GPIO.LOW)
    GPIO.output(in3, GPIO.LOW)
    GPIO.output(in4, GPIO.LOW)

    if direction == 'forward':
        GPIO.output(in1, GPIO.HIGH)
        GPIO.output(in2, GPIO.LOW)
        GPIO.output(in3, GPIO.HIGH)
        GPIO.output(in4, GPIO.LOW)
    elif direction == 'backward':
        GPIO.output(in1, GPIO.LOW)
        GPIO.output(in2, GPIO.HIGH)
        GPIO.output(in3, GPIO.LOW)
        GPIO.output(in4, GPIO.HIGH)
    elif direction == 'right':
        GPIO.output(in1, GPIO.HIGH)
        GPIO.output(in2, GPIO.LOW)
        GPIO.output(in3, GPIO.LOW)
        GPIO.output(in4, GPIO.HIGH)
    elif direction == 'left':
        GPIO.output(in1, GPIO.LOW)
        GPIO.output(in2, GPIO.HIGH)
        GPIO.output(in3, GPIO.HIGH)
        GPIO.output(in4, GPIO.LOW)

    # Set a default speed for movement
    p1.ChangeDutyCycle(50)
    p2.ChangeDutyCycle(50)

    return jsonify({'message': 'Moved ' + direction})

@app.route('/speed', methods=['POST'])
def set_speed():
    data = request.get_json()
    speed = data['speed']

    if speed == 'low':
        p1.ChangeDutyCycle(25)
        p2.ChangeDutyCycle(25)
    elif speed == 'medium':
        p1.ChangeDutyCycle(50)
        p2.ChangeDutyCycle(50)
    elif speed == 'high':
        p1.ChangeDutyCycle(75)
        p2.ChangeDutyCycle(75)

    return jsonify({'message': 'Speed set to ' + speed})

@app.route('/run_stop', methods=['POST'])
def run_stop():
    data = request.get_json()
    action = data['action']

    if action == 'run':
        # Start the motors
        GPIO.output(in1, GPIO.HIGH)
        GPIO.output(in2, GPIO.LOW)
        GPIO.output(in3, GPIO.HIGH)
        GPIO.output(in4, GPIO.LOW)
        p1.start(50)  # Adjust duty cycle as needed
        p2.start(50)
    elif action == 'stop':
        # Stop the motors
        GPIO.output(in1, GPIO.LOW)
        GPIO.output(in2, GPIO.LOW)
        GPIO.output(in3, GPIO.LOW)
        GPIO.output(in4, GPIO.LOW)
        p1.stop()
        p2.stop()

    return jsonify({'message': 'Action ' + action + ' completed'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000, debug=True)
