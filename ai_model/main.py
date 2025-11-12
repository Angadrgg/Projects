from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        temperature = data.get('temperature')
        vibration = data.get('vibration')

        # --- Basic validation ---
        if temperature is None or vibration is None:
            return jsonify({'error': 'Missing temperature or vibration data'}), 400

        # --- Dummy AI prediction logic ---
        predicted_life = max(0, 100 - (temperature * 0.5 + vibration * 2))

        return jsonify({
            'predicted_remaining_life': round(predicted_life, 2)
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("AI Model container running and listening on /predict ...")
    app.run(host='0.0.0.0', port=8000)
