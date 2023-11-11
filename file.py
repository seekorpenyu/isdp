# file.py

from flask import Flask, jsonify
import random
import time

app = Flask(__name__, template_folder='', static_folder='')

# Constants and variables
sample_interval = 1  # 1 second
battery_voltage = 7.5
battery_current = 0.0

# Simulated data
def generate_random_data():
    return {
        'solar_voltage': round(random.uniform(10, 15), 2),
        'battery_voltage': battery_voltage,
        'solar_current': round(random.uniform(1, 5), 2),
        'battery_current': battery_current,
        'battery_percentage': (battery_voltage / 7.5) * 100  # Adjust as needed
    }

@app.route('/api/get_data', methods=['GET'])
def get_data():
    data = generate_random_data()
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
