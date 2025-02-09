import React, { useState } from "react";

const EventLogger = ({ emotion }) => {
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [events, setEvents] = useState([]);
    const [journalEntry, setJournalEntry] = useState("");
    const [selectedEventId, setSelectedEventId] = useState(null);

    const logEvent = async () => {
        if (!eventName || !eventDate) {
            alert("Please fill in both event name and date.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/log_event/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ event_name: eventName, event_date: eventDate, emotion }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Event Logged:", data);  // Debugging

            // Update the events list with the new event
            setEvents([...events, { 
                id: data.event_id, 
                event_name: eventName, 
                event_date: eventDate, 
                predictive_stress_level: data.predictive_stress_level,
                emotion_based_stress_level: data.emotion_based_stress_level
            }]);

            // Clear the form
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
                body: JSON.stringify({ event_id: selectedEventId, journal_entry: journalEntry }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Journal Logged:", data);  // Debugging

            // Clear the journal input
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
            <button onClick={logEvent} className="bg-blue-500 text-white p-2 rounded w-full">
                Log Event
            </button>

            <h3 className="text-lg font-bold mt-4">Upcoming Events</h3>
            {events.length === 0 ? (
                <p>No events logged yet.</p>
            ) : (
                <ul className="mt-2">
                    {events.map((event, index) => (
                        <li key={index} className="border p-2 rounded mb-1">
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
                    <button onClick={logJournal} className="bg-blue-500 text-white p-2 rounded w-full">
                        Log Journal Entry
                    </button>
                </div>
            )}
        </div>
    );
};

export default EventLogger;