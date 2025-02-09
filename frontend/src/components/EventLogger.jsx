import React, { useState } from "react";

const EventLogger = ({ onLogEvent }) => {
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");

    const handleLogEvent = () => {
        if (!eventName || !eventDate) {
            alert("Please fill in both event name and date.");
            return;
        }

        onLogEvent({ event_name: eventName, event_date: eventDate });
        setEventName("");
        setEventDate("");
    };

    return (
        <div className="p-4">
            <input
                type="text"
                placeholder="Event Name"
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
            <button onClick={handleLogEvent} className="bg-blue-500 text-white p-2 rounded">
                Log Event
            </button>
        </div>
    );
};

export default EventLogger;
