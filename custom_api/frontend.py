from flask import Blueprint, render_template
frontend_bp = Blueprint('frontend', __name__, template_folder='templates', static_folder='static')

@frontend_bp.route('/hindi')
def hn_index():
    return render_template('index_hn.html')

@frontend_bp.route('/english')
def en_index():
    return render_template('index_en.html')