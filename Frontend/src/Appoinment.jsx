import React, { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import axios from "axios";
import dayjs from "dayjs";
import { Link } from 'react-router-dom';

export default function Appointment() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectDate, setSelectDate] = useState(null);
    const [selectTime, setSelectTime] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [appointments, setAppointments] = useState([]); // State to store appointments

    useEffect(() => {
        axios.get("http://localhost:5000/api/appointments")
            .then(response => {
                setAppointments(response.data); // Store fetched appointments
                console.log("Fetched appointments:", response.data);
            })
            .catch(error => console.error("Error fetching appointments:", error));
    }, []);

    const handleChangeName = (event) => setName(event.target.value);
    const handleChangeEmail = (event) => setEmail(event.target.value);
    const handleChangeDate = (newDate) => setSelectDate(newDate);
    const handleChangeTime = (newTime) => setSelectTime(newTime);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!selectDate || !selectTime) {
            console.error("Date and time must be selected");
            return;
        }

        const formattedDateTime = dayjs(`${selectDate.format('YYYY-MM-DD')} ${selectTime.format('HH:mm')}`).toISOString();

        const appointmentData = {
            name,
            email,
            datetime: formattedDateTime,
        };

        setLoading(true);
        axios.post("http://localhost:5000/api/appointment", appointmentData)
            .then(response => {
                setMessage("Your appointment has been booked successfully!");
                setAppointments([...appointments, response.data]); // Add new appointment to state
                setName('');
                setEmail('');
                setSelectDate(null);
                setSelectTime(null);
            })
            .catch(error => {
                console.error("Error saving appointment:", error);
                setMessage("Failed to save appointment. Please try again.");
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="Appointment">
            <div className="background-svg"></div>
            <form onSubmit={handleSubmit}>
                <label className="inputfiled">
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={handleChangeName}
                        placeholder="Enter your name"
                        required
                    />
                </label>
                <label className="inputfiled">
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={handleChangeEmail}
                        placeholder="Enter your email"
                        required
                    />
                </label>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker
                            label="Select Date"
                            value={selectDate}
                            onChange={handleChangeDate}
                            required
                        />
                    </DemoContainer>
                    <TimeClock
                        label="Select Time"
                        value={selectTime}
                        onChange={handleChangeTime}
                        required
                    />
                </LocalizationProvider>

                <button type="submit" disabled={loading}>Submit</button>
            </form>

            {loading && <p>Loading...</p>}
            {message && <p>{message}</p>}
            <ul>
                {appointments.map((appointment) => (
                    <li key={appointment._id}>
                        {appointment.name} - {appointment.datetime}
                    </li>
                ))}
            </ul>
        </div>
    );
}
