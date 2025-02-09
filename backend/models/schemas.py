from pydantic import BaseModel

class TextInput(BaseModel):
    text: str

class EventInput(BaseModel):
    event_name: str
    event_date: str

class JournalInput(BaseModel):
    event_id: int
    journal_entry: str