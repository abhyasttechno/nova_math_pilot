import os
import logging
from google import genai
from google.genai import types

def get_client():
    API_KEY = os.environ['GEMINI_API_KEY']
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
        model="gemini-2.5-flash-lite",
        contents=[types.Content(role="user", parts=prompt_parts)],
        # stream=False # Default is False, explicitly set if needed
    )
    return response


def call_ama_gemini(prompt):
    prompt_parts = [types.Part.from_text(text=prompt)]
    response = get_client().models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=[types.Content(role="user", parts=prompt_parts)],
        # stream=False # Default is False, explicitly set if needed
    )
    return response
