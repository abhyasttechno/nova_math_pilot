import os
from flask import Flask, render_template,url_for
from custom_api.en_api import en_api
from custom_api.hn_api import hn_api
from custom_api.frontend import frontend_bp
import pymysql.cursors
from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, jsonify, session, redirect
import datetime
import pandas as pd
import io
from flask import send_file
from datetime import timedelta
from functools import wraps
from flask import Response 

# --- Initialize Flask App ---
app = Flask(__name__)
# --- Register Blueprints ---
app.register_blueprint(en_api)
app.register_blueprint(hn_api)
app.register_blueprint(frontend_bp)


# A secret key is required for session management
app.secret_key = os.urandom(24) 

app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)

@app.route('/')  
def auth():  
    return render_template('login.html')  

def get_db_connection():
    """Establishes a connection to the MySQL database."""
    try:
        connection = pymysql.connect(host='localhost',
                                     user='root',
                                     password='######',
                                     db='db_novamaths',
                                     charset='utf8mb4',
                                     cursorclass=pymysql.cursors.DictCursor)
        return connection
    except pymysql.MySQLError as e:
        print(f"Error connecting to MySQL Database: {e}")
        return None
    
# --- Authorization Decorator ---
def superadmin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('user_type') != 'superadmin':
            # For API requests, return JSON error. For page loads, redirect.
            if request.path.startswith('/superadmin/api') or request.path.startswith('/superadmin/download'):
                return jsonify({'status': 'error', 'message': 'Unauthorized access.'}), 403
            return redirect(url_for('auth'))
        return f(*args, **kwargs)
    return decorated_function

# --- Helper Function for Audit Trail ---
def log_audit_trail(user_id, endpoint, ip_address):
    """Logs an activity into the tbl_audit_trail."""
    connection = get_db_connection()
    if not connection:
        return
        
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO tbl_audit_trail (user_id, activity_endpoint, ip) VALUES (%s, %s, %s)"
            cursor.execute(sql, (user_id, endpoint, ip_address))
        connection.commit()
    except pymysql.MySQLError as e:
        print(f"Audit Trail Error: {e}")
    finally:
        connection.close()


# --- Routes ---


def generate_unique_userid(cursor, f_name, dob_str):
    """
    Generates a unique user ID based on first name and DOB.
    Example: 'john0412', 'john0412-1', etc.
    """
    if not f_name or not dob_str:
        raise ValueError("First name and date of birth are required to generate a User ID.")

    # Sanitize the first name (lowercase, no spaces)
    name_part = "".join(f_name.lower().split())

    # Get the day and month from the DOB string (e.g., "YYYY-MM-DD")
    dob = datetime.datetime.strptime(dob_str, '%Y-%m-%d')
    date_part = dob.strftime('%d%m') # DDMM format

    base_id = f"{name_part}{date_part}"
    candidate_id = base_id
    suffix = 1

    # Loop until a unique ID is found
    while True:
        sql = "SELECT COUNT(*) as count FROM tbl_user_login WHERE user_id = %s"
        cursor.execute(sql, (candidate_id,))
        result = cursor.fetchone()

        if result['count'] == 0:
            return candidate_id  # The ID is unique, return it
        else:
            # ID already exists, append a suffix and try again
            candidate_id = f"{base_id}-{suffix}"
            suffix += 1


@app.route('/get-schools', methods=['GET'])
def get_schools():
    """Fetches a unique list of school names from the database."""
    connection = get_db_connection()
    if not connection:
        return jsonify({'status': 'error', 'message': 'Database connection failed'}), 500
    
    schools = []
    try:
        with connection.cursor() as cursor:
            # Select distinct, non-empty school names
            sql = "SELECT DISTINCT school FROM tbl_user_login WHERE school IS NOT NULL AND school != '' ORDER BY school ASC"
            cursor.execute(sql)
            results = cursor.fetchall()
            # Transform the list of dictionaries into a simple list of strings
            schools = [row['school'] for row in results]
    except pymysql.MySQLError as e:
        print(f"Error fetching schools: {e}")
        return jsonify({'status': 'error', 'message': 'Could not fetch school list'}), 500
    finally:
        connection.close()

    return jsonify(schools)


@app.route('/signup', methods=['POST'])
def signup():
    """Handles signup and generates a custom unique User ID."""
    data = request.get_json()
    if not data:
        return jsonify({'status': 'error', 'message': 'Invalid data received'}), 400

    # Date of Birth is now mandatory for everyone to generate the User ID
    required_fields = [
        'f_name', 'l_name', 'dob', 'password', 'user_type', 'gender', 'med_ins', 'email', 'mobile_no'
    ]
    # NOTE: You can adjust the required_fields list as needed, but f_name and dob are essential.
    
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return jsonify({'status': 'error', 'message': f"Missing required fields: {', '.join(missing_fields)}"}), 400
    
    hashed_password = generate_password_hash(data.get('password'))
    connection = get_db_connection()
    if not connection:
        return jsonify({'status': 'error', 'message': 'Database connection failed'}), 500

    try:
        with connection.cursor() as cursor:
            # Check for existing email/mobile
            email = data.get('email')
            mobile_no = data.get('mobile_no')
            sql_check = "SELECT user_id FROM tbl_user_login WHERE email = %s OR mobile_no = %s"
            cursor.execute(sql_check, (email, mobile_no))
            if cursor.fetchone():
                return jsonify({'status': 'error', 'message': 'Email or mobile number already registered'}), 409

            # --- GENERATE THE NEW UNIQUE USER ID ---
            new_user_id = generate_unique_userid(cursor, data.get('f_name'), data.get('dob'))

            # Prepare SQL to insert the new user with the custom user_id
            sql_insert = """
                INSERT INTO tbl_user_login (
                    user_id, f_name, l_name, gender, dob, email, mobile_no, pass_word, user_type,
                    school, class, board, med_ins, state, city, status_reg
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'unreg')
            """
            
            insert_data = (
                new_user_id,  # The new custom ID
                data.get('f_name'), data.get('l_name'),
                data.get('gender'), data.get('dob'), email, mobile_no,
                hashed_password, data.get('user_type'), data.get('school'),
                'NA', data.get('board'), data.get('med_ins'),
                data.get('state'), data.get('city')
            )

            cursor.execute(sql_insert, insert_data)
            log_audit_trail(new_user_id, '/signup', request.remote_addr)
        
        connection.commit()
        
        # --- RETURN THE NEW USER ID IN THE RESPONSE ---
        return jsonify({
            'status': 'success', 
            'message': 'Signup successful! Please note your new User ID.',
            'user_id': new_user_id  # Send the ID back to the frontend
        }), 201

    except (pymysql.MySQLError, ValueError) as e:
        connection.rollback()
        print(f"Error on Signup: {e}")
        return jsonify({'status': 'error', 'message': f'An internal error occurred: {e}'}), 500
    finally:
        connection.close()

@app.route('/login', methods=['POST'])
def login():
    identifier = request.form.get('identifier')
    password = request.form.get('password')

    if not identifier or not password:
        return render_template('login.html', error="User ID and password are required.")

    connection = get_db_connection()
    if not connection:
        return render_template('login.html', error="Database connection failed.")

    try:
        with connection.cursor() as cursor:
            sql = "SELECT user_id, f_name, pass_word, user_type, med_ins FROM tbl_user_login WHERE user_id = %s"
            cursor.execute(sql, (identifier,))
            user = cursor.fetchone()

            if user and check_password_hash(user['pass_word'], password):
                if password == '111111':
                    return render_template('login.html', show_reset_form=True, user_id_to_reset=user['user_id'])
                
                session.permanent = True
                session['user_id'] = user['user_id']
                session['user_name'] = user['f_name']
                session['user_type'] = user['user_type']
                
                log_audit_trail(user['user_id'], '/login', request.remote_addr)

                # MODIFIED: Redirect based on user_type
                if user['user_type'] == 'superadmin':
                    return redirect(url_for('super_admin_panel'))
                elif user['user_type'] == 'admin':
                    return render_template('admin_panel.html', user_id=user['user_id'], user_name=user['f_name'])
                else: # 'student' or 'teacher'
                    template = 'index_hn.html' if user['med_ins'] == 'Hindi' else 'index_en.html'
                    return render_template(template, user_id=user['user_id'], user_name=user['f_name'])
            else:
                return render_template('login.html', error="Invalid User ID or password.")
    except Exception as e:
        print(f"Database Error on Login: {e}")
        return render_template('login.html', error="An internal error occurred.")
    finally:
        if connection: connection.close()


@app.route('/force-reset-password', methods=['POST'])
def force_reset_password():
    user_id = request.form.get('user_id')
    new_password = request.form.get('new_password')
    confirm_password = request.form.get('confirm_new_password')

    # --- Validation ---
    if not all([user_id, new_password, confirm_password]):
        return render_template('login.html', error="All fields are required.", show_reset_form=True, user_id_to_reset=user_id)

    if new_password != confirm_password:
        return render_template('login.html', error="Passwords do not match. Please try again.", show_reset_form=True, user_id_to_reset=user_id)
    
    if len(new_password) < 8:
        return render_template('login.html', error="Password must be at least 8 characters long.", show_reset_form=True, user_id_to_reset=user_id)

    # Hash the new password
    hashed_password = generate_password_hash(new_password)
    
    connection = get_db_connection()
    if not connection:
        return render_template('login.html', error="Database connection failed.", show_reset_form=True, user_id_to_reset=user_id)

    try:
        with connection.cursor() as cursor:
            # --- Update the password in the database ---
            sql_update = "UPDATE tbl_user_login SET pass_word = %s WHERE user_id = %s"
            cursor.execute(sql_update, (hashed_password, user_id))
            
            # --- After successful update, log the user in ---
            # Fetch the user's full details again to create the session
            sql_fetch = "SELECT user_id, f_name, user_type, med_ins FROM tbl_user_login WHERE user_id = %s"
            cursor.execute(sql_fetch, (user_id,))
            user = cursor.fetchone()

        connection.commit()

        # Create the session just like in the normal login flow
        session.permanent = True
        session['user_id'] = user['user_id']
        session['user_name'] = user['f_name']
        session['user_type'] = user['user_type']
        
        log_audit_trail(user['user_id'], '/force-reset-password', request.remote_addr)

        # Redirect to the correct dashboard
        if user['user_type'] == 'admin':
            return render_template('admin_panel.html', user_id=user['user_id'], user_name=user['f_name'])
        else:
            if user['med_ins'] == 'Hindi':
                return render_template('index_hn.html', user_id=user['user_id'], user_name=user['f_name'])
            else:
                return render_template('index_en.html', user_id=user['user_id'], user_name=user['f_name'])

    except pymysql.MySQLError as e:
        connection.rollback()
        print(f"Error during password reset: {e}")
        return render_template('login.html', error="A database error occurred.", show_reset_form=True, user_id_to_reset=user_id)
    finally:
        connection.close()

@app.route('/dashboard')
def dashboard():
    """A protected route, accessible only after login."""
    if 'user_id' in session:
        return f"<h1>Welcome to the Dashboard, {session['user_name']}!</h1><p>Your user type is: {session['user_type']}</p><a href='/logout'>Logout</a>"
    else:
        return redirect(url_for('auth_page'))

@app.route('/logout')
def logout():
    """Logs the user out by clearing the session."""
    session.clear()
    return redirect('/')


@app.route('/download-template')
def download_template():
    """Generates and serves a sample Excel template file."""
    # Define the required columns and a sample row
    # IMPORTANT: Column names here should match what the upload logic expects
    data = {
        's.no.': [1],
        'student_first_name': ['Aarav'],
        'student_last_name': ['Sharma'],
        'gender': ['Male'],
        'dob': ['2010-05-15'],
        'class': ['8']
    }
    df = pd.DataFrame(data)

    # Create an in-memory Excel file
    output = io.BytesIO()
    # Use with statement to ensure the writer is properly closed
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Students')
    output.seek(0)

    return send_file(
        output,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        as_attachment=True,
        download_name='student_upload_template.xlsx'
    )


@app.route('/upload-students', methods=['POST'])
def upload_students():
    """
    Receives an Excel file, validates its columns and data,
    stores valid data in the session, and returns a JSON preview.
    """
    if 'user_id' not in session:
        return jsonify({'status': 'error', 'message': 'Unauthorized. Please log in.'}), 401

    if 'file' not in request.files:
        return jsonify({'status': 'error', 'message': 'No file part in the request.'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'status': 'error', 'message': 'No file selected.'}), 400

    if file and file.filename.endswith(('.xlsx', '.xls')):
        try:
            # Read excel file, ensuring DOB and mobile are treated as strings
            df = pd.read_excel(file, dtype={'dob': str, 'mobile_no': str})
            
            # --- Column Validation and Standardization ---
            df.columns = [str(col).strip().lower().replace(' ', '_').replace('.', '') for col in df.columns]

            required_columns = [
                'sno', 'student_first_name', 'student_last_name', 'gender', 'dob',
                'class'
            ]
            
            missing_cols = [col for col in required_columns if col not in df.columns]
            if missing_cols:
                return jsonify({
                    'status': 'error', 
                    'message': f'The uploaded file is missing required columns: {", ".join(missing_cols)}'
                }), 400
            
            # --- Data Validation ---
            # Convert various date formats to a standard 'YYYY-MM-DD'
            df['dob'] = pd.to_datetime(df['dob'], errors='coerce').dt.strftime('%Y-%m-%d')
            if df['dob'].isnull().any():
                # Find the first row with an invalid date to give a better error message
                invalid_row_index = df[df['dob'].isnull()].index[0] + 2 # +2 for header and 0-indexing
                return jsonify({
                    'status': 'error', 
                    'message': f'Invalid date format found in DOB column near row {invalid_row_index}. Please use YYYY-MM-DD, DD-MM-YYYY, or a similar recognizable format.'
                }), 400

            # Fill NaN values in optional columns with empty strings
            df.fillna('', inplace=True)

            # Store the validated data in session to be used by the confirm route
            # Convert to JSON string for session storage
            session['uploaded_data'] = df.to_dict(orient='records')
            
            # Return the data as JSON for the frontend preview
            return jsonify({
                'status': 'success',
                'data': df.to_dict(orient='records')
            })

        except Exception as e:
            print(f"Error processing Excel file: {e}")
            return jsonify({'status': 'error', 'message': f'An error occurred while processing the file: {e}'}), 500
    
    return jsonify({'status': 'error', 'message': 'Invalid file type. Please upload a .xlsx or .xls file.'}), 400


@app.route('/confirm-upload', methods=['POST'])
def confirm_upload():
    """
    Confirms and saves student data from the session, skipping any duplicates.
    A duplicate is defined by the same f_name, l_name, dob, class, and gender.
    """
    if 'user_id' not in session:
        return jsonify({'status': 'error', 'message': 'Unauthorized. Please log in again.'}), 401
    
    if 'uploaded_data' not in session or not session['uploaded_data']:
        return jsonify({'status': 'error', 'message': 'No data to confirm. Please upload a file first.'}), 400

    students_to_upload = session['uploaded_data']
    admin_user_id = session['user_id']
    
    connection = get_db_connection()
    if not connection:
        return jsonify({'status': 'error', 'message': 'Database connection failed'}), 500

    inserted_count = 0
    skipped_count = 0

    try:
        with connection.cursor() as cursor:
            # ====================================================================
            # FIX #1: Get admin details ONCE, BEFORE the loop starts.
            # ====================================================================
            admin_details_sql = """
                SELECT email, mobile_no, school, board, state, city, med_ins 
                FROM tbl_user_login 
                WHERE user_id = %s
            """
            cursor.execute(admin_details_sql, (admin_user_id,))
            admin_data = cursor.fetchone()
            if not admin_data:
                # This is an edge case, but good to handle
                return jsonify({'status': 'error', 'message': 'Could not retrieve admin details.'}), 500

            # The main loop to process each student from the uploaded file
            for student_data in students_to_upload:
                f_name = student_data.get('student_first_name')
                l_name = student_data.get('student_last_name')
                dob = student_data.get('dob')
                student_class = student_data.get('class')
                gender = student_data.get('gender')

                if not all([f_name, l_name, dob, student_class, gender]):
                    skipped_count += 1
                    continue

                check_sql = """
                    SELECT 1 FROM tbl_user_login 
                    WHERE f_name = %s AND l_name = %s AND dob = %s AND class = %s AND gender = %s
                """
                cursor.execute(check_sql, (f_name, l_name, dob, student_class, gender))
                exists = cursor.fetchone()

                if exists:
                    skipped_count += 1
                else:
                    new_user_id = generate_unique_userid(cursor, f_name, dob)
                    temp_password = "111111"
                    hashed_password = generate_password_hash(temp_password)

                    insert_sql = """
                        INSERT INTO tbl_user_login 
                        (user_id, f_name, l_name, gender, dob, email, mobile_no, state, city, board, med_ins, class, pass_word, status_reg, created_by, created_at) 
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    # ====================================================================
                    # FIX #2: Provide all 16 values in the correct order.
                    # ====================================================================
                    cursor.execute(insert_sql, (
                        new_user_id,
                        f_name,
                        l_name,
                        gender,
                        dob,
                        admin_data['email'],      # Use admin's data
                        admin_data['mobile_no'],  # Use admin's data
                        admin_data['state'],      # Use admin's data
                        admin_data['city'],       # Use admin's data
                        admin_data['board'],      # Use admin's data
                        admin_data['med_ins'],    # Use admin's data
                        student_class,
                        hashed_password,
                        'reg',
                        admin_user_id,
                        datetime.datetime.now()
                    ))
                    inserted_count += 1
            
            connection.commit()
            session.pop('uploaded_data', None)
            
            message = f"Upload complete! Inserted: {inserted_count} new students. Skipped: {skipped_count} duplicates or invalid records."
            return jsonify({'status': 'success', 'message': message})

    except pymysql.MySQLError as e:
        connection.rollback()
        print(f"Database error during confirm upload: {e}")
        return jsonify({'status': 'error', 'message': 'A database error occurred. No records were saved.'}), 500
    except Exception as e:
        connection.rollback()
        print(f"An unexpected error occurred during confirm upload: {e}")
        return jsonify({'status': 'error', 'message': f'An unexpected error occurred: {e}'}), 500
    finally:
        connection.close()

@app.route('/get-registered-students', methods=['GET'])
def get_registered_students():
    """Fetches all students uploaded by the currently logged-in admin."""
    if 'user_id' not in session:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401

    admin_user_id = session['user_id']
    connection = get_db_connection()
    if not connection:
        return jsonify({'status': 'error', 'message': 'Database connection failed'}), 500
    
    try:
        with connection.cursor() as cursor:
            sql = """
                SELECT user_id, f_name, l_name, gender,dob,class,status_reg, created_at 
                FROM tbl_user_login 
                WHERE created_by = %s 
                ORDER BY created_at DESC
            """
            cursor.execute(sql, (admin_user_id,))
            students = cursor.fetchall()
            # Convert datetime objects to string for JSON serialization
            for student in students:
                if 'created_at' in student and student['created_at']:
                    student['created_at'] = student['created_at'].strftime('%Y-%m-%d %H:%M:%S')
                if 'dob' in student and student['dob']:
                    student['dob'] = student['dob'].strftime('%Y-%m-%d')

            return jsonify({'status': 'success', 'data': students})
    except pymysql.MySQLError as e:
        print(f"Error fetching registered students: {e}")
        return jsonify({'status': 'error', 'message': 'Could not fetch student list'}), 500
    finally:
        connection.close()


@app.route('/superadmin')
@superadmin_required
def super_admin_panel():
    return render_template('super_admin_panel.html')

def build_filter_query(base_query, params, date_column, school_join_table=None):
    """Helper function to build dynamic WHERE clauses for reports."""
    filters = []
    query_params = []
    
    school = params.get('school')
    from_date = params.get('from_date')
    to_date = params.get('to_date')

    if school:
        # Assumes a 'u' alias for tbl_user_login if a join is needed
        table_prefix = 'u.' if school_join_table else ''
        filters.append(f"{table_prefix}school = %s")
        query_params.append(school)
    if from_date:
        filters.append(f"{date_column} >= %s")
        query_params.append(from_date)
    if to_date:
        # Add 1 day to to_date to make the range inclusive
        to_date_inclusive = datetime.datetime.strptime(to_date, '%Y-%m-%d') + timedelta(days=1)
        filters.append(f"{date_column} < %s")
        query_params.append(to_date_inclusive.strftime('%Y-%m-%d'))

    if filters:
        return f"{base_query} WHERE {' AND '.join(filters)}", tuple(query_params)
    return base_query, tuple(query_params)

# --- API Routes for fetching report data ---

@app.route('/superadmin/api/user-logins')
@superadmin_required
def get_user_logins_report():
    connection = get_db_connection()
    if not connection: return jsonify({'status': 'error', 'message': 'Database connection failed'}), 500
    try:
        with connection.cursor() as cursor:
            base_sql = "SELECT user_id, f_name, l_name, gender, dob, email, mobile_no, user_type, school, class, board, med_ins, state, city, created_at, status_reg, created_by FROM tbl_user_login"
            query, params = build_filter_query(base_sql, request.args, date_column='created_at')
            query += " ORDER BY created_at DESC"
            cursor.execute(query, params)
            data = cursor.fetchall()
            for row in data:
                for key, value in row.items():
                    if isinstance(value, (datetime.date, datetime.datetime)):
                        row[key] = value.strftime('%Y-%m-%d %H:%M:%S')
            return jsonify({'status': 'success', 'data': data})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        if connection: connection.close()

@app.route('/superadmin/api/audit-trail')
@superadmin_required
def get_audit_trail_report():
    connection = get_db_connection()
    if not connection: return jsonify({'status': 'error', 'message': 'Database connection failed'}), 500
    try:
        with connection.cursor() as cursor:
            base_sql = "SELECT a.s_no, a.user_id, u.school, a.activity_endpoint, a.ip, a.use_time FROM tbl_audit_trail a LEFT JOIN tbl_user_login u ON a.user_id = u.user_id"
            query, params = build_filter_query(base_sql, request.args, date_column='a.use_time', school_join_table='u')
            query += " ORDER BY a.use_time DESC"
            cursor.execute(query, params)
            data = cursor.fetchall()
            for row in data:
                if row.get('use_time'): row['use_time'] = row['use_time'].strftime('%Y-%m-%d %H:%M:%S')
            return jsonify({'status': 'success', 'data': data})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        if connection: connection.close()

@app.route('/superadmin/api/student-surveys')
@superadmin_required
def get_student_surveys_report():
    connection = get_db_connection()
    if not connection: return jsonify({'status': 'error', 'message': 'Database connection failed'}), 500
    try:
        with connection.cursor() as cursor:
            base_sql = "SELECT s.id, s.user_id, u.school, s.question, s.response, s.created_at FROM student_survey s LEFT JOIN tbl_user_login u ON s.user_id = u.user_id"
            query, params = build_filter_query(base_sql, request.args, date_column='s.created_at', school_join_table='u')
            query += " ORDER BY s.created_at DESC"
            cursor.execute(query, params)
            data = cursor.fetchall()
            for row in data:
                if row.get('created_at'): row['created_at'] = row['created_at'].strftime('%Y-%m-%d %H:%M:%S')
            return jsonify({'status': 'success', 'data': data})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        if connection: connection.close()

# --- API Routes for User Management (Edit/Delete) ---

@app.route('/superadmin/api/user/update', methods=['POST'])
@superadmin_required
def update_user_record():
    data = request.json
    connection = get_db_connection()
    if not connection: return jsonify({'status': 'error', 'message': 'Database connection failed'}), 500
    try:
        with connection.cursor() as cursor:
            sql = """UPDATE tbl_user_login SET 
                     f_name=%s, l_name=%s, email=%s, mobile_no=%s, school=%s, class=%s, board=%s, state=%s, city=%s
                     WHERE user_id=%s"""
            cursor.execute(sql, (
                data['f_name'], data['l_name'], data['email'], data['mobile_no'],
                data.get('school'), data.get('class'), data.get('board'), data.get('state'), data.get('city'),
                data['user_id']
            ))
        connection.commit()
        return jsonify({'status': 'success', 'message': 'User updated successfully'})
    except Exception as e:
        connection.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        if connection: connection.close()

@app.route('/superadmin/api/user/delete', methods=['POST'])
@superadmin_required
def delete_user_record():
    data = request.json
    user_id = data.get('user_id')
    if not user_id: return jsonify({'status': 'error', 'message': 'User ID is required'}), 400
    
    connection = get_db_connection()
    if not connection: return jsonify({'status': 'error', 'message': 'Database connection failed'}), 500
    try:
        with connection.cursor() as cursor:
            sql = "DELETE FROM tbl_user_login WHERE user_id = %s"
            cursor.execute(sql, (user_id,))
        connection.commit()
        return jsonify({'status': 'success', 'message': 'User deleted successfully'})
    except pymysql.MySQLError as e:
        connection.rollback()
        return jsonify({'status': 'error', 'message': f'Database error: {e}'}), 500
    finally:
        if connection: connection.close()


# --- Routes for Downloading Excel Reports ---

def serve_excel(data, filename):
    """Helper to convert a list of dicts to an Excel file and serve it."""
    if not data:
        # Return a proper Flask Response object for better error handling in the browser
        return Response("No data found for the selected criteria. The report cannot be generated.", 
                        status=404, 
                        mimetype='text/plain')
                        
    # Convert datetime objects to timezone-unaware strings for consistent Excel output
    for row in data:
        for key, value in row.items():
            if isinstance(value, (datetime.date, datetime.datetime)):
                row[key] = value.strftime('%Y-%m-%d %H:%M:%S')

    df = pd.DataFrame(data)
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Report')
    output.seek(0)
    return send_file(
        output,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        as_attachment=True,
        download_name=filename
    )

@app.route('/superadmin/download/<report_type>')
@superadmin_required
def download_report(report_type):
    connection = get_db_connection()
    if not connection: return "Database connection failed", 500

    try:
        with connection.cursor() as cursor:
            if report_type == 'user-logins':
                base_sql = "SELECT user_id, f_name, l_name, gender, dob, email, mobile_no, user_type, school, class, board, med_ins, state, city, created_at, status_reg, created_by FROM tbl_user_login"
                query, params = build_filter_query(base_sql, request.args, 'created_at')
                filename = "user_logins_report.xlsx"
            elif report_type == 'audit-trail':
                base_sql = "SELECT a.s_no, a.user_id, u.school, a.activity_endpoint, a.ip, a.use_time FROM tbl_audit_trail a LEFT JOIN tbl_user_login u ON a.user_id = u.user_id"
                query, params = build_filter_query(base_sql, request.args, 'a.use_time', 'u')
                filename = "audit_trail_report.xlsx"
            elif report_type == 'student-surveys':
                base_sql = "SELECT s.id, s.user_id, u.school, s.question, s.response, s.created_at FROM student_survey s LEFT JOIN tbl_user_login u ON s.user_id = u.user_id"
                query, params = build_filter_query(base_sql, request.args, 's.created_at', 'u')
                filename = "student_surveys_report.xlsx"
            else:
                return "Invalid report type", 404

            query += " ORDER BY 1 DESC"
            cursor.execute(query, params)
            data = cursor.fetchall()
            return serve_excel(data, filename)
    except Exception as e:
        return f"An error occurred: {e}", 500
    finally:
        if connection: connection.close()





# --- Run the Flask App ---
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080)) # Use PORT env var or default to 8080
    app.run(host='0.0.0.0', port=port, debug=True)