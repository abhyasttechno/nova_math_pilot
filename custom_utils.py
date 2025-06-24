import os
import logging
from google import genai
from google.genai import types
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json


def get_firebase_db_client():
    firebase_app = None
    # Option 1 (Recommended for Deployment): Load credentials from an environment variable
    firebase_credentials_json_string = os.environ.get(
        'FIREBASE_CREDENTIALS_JSON')

    if firebase_credentials_json_string:
        try:
            # Parse the JSON string content from the environment variable
            cred = credentials.Certificate(
                json.loads(firebase_credentials_json_string))
            firebase_app = firebase_admin.initialize_app(cred)
            print("Firebase initialized successfully from environment variable.")

        except json.JSONDecodeError as e:
            print(
                f"Firebase initialization error: Failed to parse FIREBASE_CREDENTIALS_JSON environment variable as JSON: {e}")
            print("Ensure the FIREBASE_CREDENTIALS_JSON environment variable contains the exact JSON content of your service account key file.")
            # The app will continue but without Firebase functionality
        except Exception as e:
            print(
                f"Unexpected error initializing Firebase from environment variable: {e}")
            # Handle other potential errors during initialization
            # The app will continue but without Firebase functionality

    else:
        # Option 2 (Fallback for Local Development): Load credentials from a local file
        # Make sure this file path is correct for your local environment
        # IMPORTANT: Ensure this file is NOT committed to your public repository!
        local_credential_path = 'nova-maths-feedback-firebase-adminsdk-fbsvc-9c15ee16fc.json'
        if os.path.exists(local_credential_path):
            try:
                # Pass the file path directly
                cred = credentials.Certificate(local_credential_path)
                firebase_app = firebase_admin.initialize_app(cred)
                print(
                    f"Firebase initialized successfully from local file: {local_credential_path}")

            except Exception as e:
                print(
                    f"Error initializing Firebase from local file '{local_credential_path}': {e}")
                print("Ensure the local credential file exists and is valid.")
                # The app will continue but without Firebase functionality
        else:
            print(
                f"Firebase initialization skipped: Neither FIREBASE_CREDENTIALS_JSON environment variable nor local file '{local_credential_path}' found.")
            print("Feedback submission will not work until Firebase is configured.")
            # The app will start but Firebase is not initialized

    # Get Firestore client reference ONLY if the app was successfully initialized
    if firebase_app:
        try:
            db = firestore.client()
            print("Firestore client obtained.")
        except Exception as e:
            print(f"Error obtaining Firestore client: {e}")
            db = None  # Ensure db is None if client creation failed

    return db


def get_client():
    API_KEY = os.environ['GEMINI_API_KEY']
    # API_KEY="AIzaSyBNPrThRfqzW_lJpFd1F9lyepRM7q1SghU"
    client = None  # Initialize as None

    if not API_KEY:
        logging.error("GEMINI_API_KEY environment variable not set!")
    else:
        try:
            client = genai.Client(api_key=API_KEY)
            # logging.info("Gemini API client initialized successfully.")
        except Exception as e:
            logging.error(f"Failed to configure Gemini API client: {e}")
            client = None  # Ensure client is None if initialization fails
    return client


def call_gemini(prompt):
    prompt_parts = [types.Part.from_text(text=prompt)]
    response = get_client().models.generate_content(
        model="gemini-2.0-flash-lite",
        contents=[types.Content(role="user", parts=prompt_parts)],
        # stream=False # Default is False, explicitly set if needed
    )
    return response


def call_ama_gemini(prompt):
    prompt_parts = [types.Part.from_text(text=prompt)]
    response = get_client().models.generate_content(
        model="gemini-2.0-flash-lite",
        contents=[types.Content(role="user", parts=prompt_parts)],
        # stream=False # Default is False, explicitly set if needed
    )
    return response
