from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.crud import log_journal_entry
from models.schemas import JournalInput
from models.database import get_db

router = APIRouter()

@router.post("/log_journal/")
async def log_journal(journal_input: JournalInput, db: Session = Depends(get_db)):
    db_journal = log_journal_entry(db, journal_input)
    return {"message": "Journal entry logged successfully", "journal": db_journal}
