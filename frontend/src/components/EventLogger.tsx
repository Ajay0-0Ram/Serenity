import React, { useState } from "react";
import styles from "./EventLogger.module.css"; // Importing CSS Module

type Event = {
  id: number;
  event_name: string;
  event_date: string;
  predictive_stress_level: number;
  emotion_based_stress_level: number;
};

type EventLoggerProps = {
  emotion: string;
};

const EventLogger: React.FC<EventLoggerProps> = ({ emotion }) => {
  const [eventName, setEventName] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [journalEntry, setJournalEntry] = useState<string>("");
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const logEvent = async () => {
    if (!eventName || !eventDate) {
      alert("Please fill in both event name and date.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/log_event/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: eventName,
          event_date: eventDate,
          emotion,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Event Logged:", data);

      setEvents([
        ...events,
        {
          id: data.event_id,
          event_name: eventName,
          event_date: eventDate,
          predictive_stress_level: data.predictive_stress_level,
          emotion_based_stress_level: data.emotion_based_stress_level,
        },
      ]);

      setEventName("");
      setEventDate("");
    } catch (error) {
      console.error("Error logging event:", error);
      alert("Failed to log event. Check the console for details.");
    }
  };

  const logJournal = async () => {
    if (!selectedEventId || !journalEntry) {
      alert("Please select an event and write a journal entry.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/log_journal/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: selectedEventId,
          journal_entry: journalEntry,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Journal Logged:", data);

      setJournalEntry("");
      alert("Journal entry logged successfully!");
    } catch (error) {
      console.error("Error logging journal:", error);
      alert("Failed to log journal entry. Check the console for details.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Log an Upcoming Event</h2>
      <input
        type="text"
        placeholder="Event Name (e.g., Exam, Meeting)"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        className={styles.inputField}
      />
      <input
        type="date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        className={styles.inputField}
      />
      <button onClick={logEvent} className={styles.buttonPrimary}>
        Log Event
      </button>

      <h3 className={styles.subHeading}>Upcoming Events</h3>
      {events.length === 0 ? (
        <p>No events logged yet.</p>
      ) : (
        <ul className={styles.eventList}>
          {events.map((event) => (
            <li key={event.id} className={styles.eventItem}>
              <strong>{event.event_name}</strong> - {event.event_date}
              <br />
              Predictive Stress Level: {event.predictive_stress_level}/10
              <br />
              Emotion-Based Stress Level: {event.emotion_based_stress_level}/10
              <button
                onClick={() => setSelectedEventId(event.id)}
                className={styles.buttonSecondary}
              >
                Journal for this event
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedEventId && (
        <div className={styles.journalContainer}>
          <h3 className={styles.subHeading}>Journal for Selected Event</h3>
          <textarea
            placeholder="How are you feeling about this event?"
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            className={styles.textArea}
          />
          <button onClick={logJournal} className={styles.buttonPrimary}>
            Log Journal Entry
          </button>
        </div>
      )}
    </div>
  );
};

export default EventLogger;
