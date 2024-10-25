import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const ShowAppointment = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/appointments")
            .then(response => {
                setAppointments(response.data);
            })
            .catch(error => console.error("Error fetching appointments:", error));
    }, []);

    // Function to show browser notification
    const showNotification = (title, body) => {
        if (Notification.permission === 'granted') {
            new Notification(title, { body });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body });
                }
            });
        }
    };

    // Accept appointment
    const acceptAppointment = (id) => {
        axios.put(`http://localhost:5000/api/appointments/accept/${id}`)
            .then(response => {
                console.log("Appointment accepted:", response.data);
                setAppointments(appointments.map(appt =>
                    appt._id === id ? { ...appt, status: "accepted" } : appt
                ));

                // Show browser notification for acceptance
                showNotification("Appointment Accepted", "The appointment has been accepted and the user has been notified via email.");
            })
            .catch(error => console.error("Error accepting appointment:", error));
    };

    return (
        <div>
            <h2>Appointments</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date and Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map(appointment => (
                        <tr key={appointment._id}>
                            <td>{appointment.name}</td>
                            <td>{dayjs(appointment.datetime).format("DD-MM-YY HH:mm")}</td>
                            <td>{appointment.status}</td>
                            <td>
                                <button onClick={() => acceptAppointment(appointment._id)}>
                                    Accept
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShowAppointment;