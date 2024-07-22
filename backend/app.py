from flask import Flask, jsonify
from flask_cors import CORS
import secrets

app = Flask(__name__)

CORS(app)

# Endpoint to initialize a session and return a unique session ID
@app.route('/initialize_session', methods=['GET'])
def initialize_session():
    # Generate a unique session ID
    session_id = secrets.token_hex(16)  # Generates a 32-character hex string
    return jsonify({'session_id': session_id})

if __name__ == '__main__':
    app.run(debug=True)
