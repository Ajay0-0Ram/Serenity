import React, { useState, useEffect } from "react";

const EventLogger = () => {
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [events, setEvents] = useState([]);  // ✅ Initialize with an empty array
    const [alerts, setAlerts] = useState([]);

    // Fetch upcoming events and stress alerts
    useEffect(() => {
        fetch("http://127.0.0.1:8000/upcoming_events/")
            .then((response) => response.json())
            .then((data) => {
                setEvents(data.upcoming_events || []);  // ✅ Default to empty array if undefined
                setAlerts(data.alerts || []);
            })
            .catch((error) => {
                console.error("🚨 Error fetching events:", error);
                setEvents([]);  // ✅ Set empty array in case of error
            });
    }, []);

    // Log a new event
    const logEvent = async () => {
        if (!eventName || !eventDate) return;

        try {
            const response = await fetch("http://127.0.0.1:8000/log_event/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ event_name: eventName, event_date: eventDate }),
            });

            const data = await response.json();
            console.log("Event Logged:", data);

            setEvents([...events, { 
                event_name: eventName, 
                event_date: eventDate, 
                stress_level: data.predicted_stress_level 
            }]);

            setEventName("");
            setEventDate("");
        } catch (error) {
            console.error("Error logging event:", error);
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
            {events.length === 0 ? <p>No events logged yet.</p> : (
                <ul className="mt-2">
                    {events.map((event, index) => (
                        <li key={index} className="border p-2 rounded mb-1">
                            <strong>{event.event_name}</strong> - {event.event_date} 
                            <br />
                            Stress Level: {event.stress_level}/10
                        </li>
                    ))}
                </ul>
            )}

            <h3 className="text-lg font-bold mt-4">Alerts</h3>
            {alerts.length === 0 ? <p>No upcoming stress alerts.</p> : (
                <ul className="mt-2 bg-red-100 p-2 rounded">
                    {alerts.map((alert, index) => (
                        <li key={index} className="text-red-700">
                            <strong>{alert.event}</strong> on {alert.event_date}: {alert.alert}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EventLogger;
