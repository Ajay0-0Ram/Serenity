from fastapi import APIRouter
from models.database import DB_PATH
from models.schemas import JournalInput
import sqlite3

router = APIRouter()

@router.post("/log_journal/")
async def log_journal(journal_input: JournalInput):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO journals (event_id, journal_entry)
        VALUES (?, ?)
    """, (journal_input.event_id, journal_input.journal_entry))
    conn.commit()
    conn.close()
    
    return {"message": "Journal entry logged successfully"}