import sqlite3
import os

DB_PATH = "emotions.db"

def create_tables():
    """ Ensures all required tables exist before the app starts """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Ensure 'emotions' table exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS emotions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            emotion TEXT,
            confidence REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Ensure 'events' table exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_name TEXT,
            event_date TEXT,
            event_type TEXT,
            predictive_stress_level INTEGER,
            emotion_based_stress_level INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Ensure 'journals' table exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS journals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER,
            journal_entry TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (event_id) REFERENCES events (id)
        )
    """)

    conn.commit()
    conn.close()

# Ensure tables exist before app runs
create_tables()