import os
from flask import Flask, render_template
from custom_api.en_api import en_api
from custom_api.hn_api import hn_api
from custom_api.frontend import frontend_bp

app = Flask(__name__)
# --- Register Blueprints ---
app.register_blueprint(en_api)
app.register_blueprint(hn_api)
app.register_blueprint(frontend_bp)

# --- Run the Flask App ---
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080)) # Use PORT env var or default to 8080
    app.run(host='0.0.0.0', port=port, debug=True)