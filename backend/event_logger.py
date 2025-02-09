import sqlite3

DB_PATH = "emotions.db"

def log_event(event_name: str):
    """
    Log an event to the database.

    Args:
        event_name (str): The name of the event to log.
    """
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO events (event_name) VALUES (?)", (event_name,))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error logging event: {e}")
