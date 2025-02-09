import React, { useState } from "react";

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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Log an Upcoming Event</h2>
      <input
        type="text"
        placeholder="Event Name (e.g., Exam, Meeting)"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <button
        onClick={logEvent}
        className="bg-blue-500 text-white p-2 rounded w-full"
      >
        Log Event
      </button>

      <h3 className="text-lg font-bold mt-4">Upcoming Events</h3>
      {events.length === 0 ? (
        <p>No events logged yet.</p>
      ) : (
        <ul className="mt-2">
          {events.map((event) => (
            <li key={event.id} className="border p-2 rounded mb-1">
              <strong>{event.event_name}</strong> - {event.event_date}
              <br />
              Predictive Stress Level: {event.predictive_stress_level}/10
              <br />
              Emotion-Based Stress Level: {event.emotion_based_stress_level}/10
              <button
                onClick={() => setSelectedEventId(event.id)}
                className="bg-green-500 text-white p-1 rounded mt-1"
              >
                Journal for this event
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedEventId && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Journal for Selected Event</h3>
          <textarea
            placeholder="How are you feeling about this event?"
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <button
            onClick={logJournal}
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Log Journal Entry
          </button>
        </div>
      )}
    </div>
  );
};

const TextAnalyzer: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [emotion, setEmotion] = useState<{
    emotion: string;
    confidence: number | null;
  } | null>(null);

  const analyzeText = async () => {
    if (!text) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze_text/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      console.log("API Response in React:", data);

      setEmotion({
        emotion: data.emotion || "Unknown",
        confidence: data.confidence !== undefined ? data.confidence : null,
      });
    } catch (error) {
      console.error("Error analyzing text:", error);
    }
  };

  return (
    <div className="p-4">
      <textarea
        placeholder="Type something here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 w-full rounded-lg"
      />
      <button
        onClick={analyzeText}
        className="mt-2 bg-blue-500 text-white p-2 rounded"
      >
        Analyze Text
      </button>
      {emotion && (
        <p className="mt-4 text-lg">
          Detected Emotion: <strong>{emotion.emotion}</strong>
          {emotion.confidence !== null
            ? ` (Confidence: ${emotion.confidence.toFixed(2)})`
            : ""}
        </p>
      )}
    </div>
  );
};

export { EventLogger, TextAnalyzer };
