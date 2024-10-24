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
    const [email, setEmail] = useState(''); // Email state
    const [selectDate, setSelectDate] = useState(null);
    const [selectTime, setSelectTime] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get("http://192.168.0.104:5000/api/appointments")
            .then(response => {
                console.log("Fetched appointments:", response.data);
            })
            .catch(error => console.error("Error fetching appointments:", error));
    }, []);

    const handleChangeName = (event) => {
        setName(event.target.value);
    };

    const handleChangeEmail = (event) => {
        setEmail(event.target.value);
    };

    const handleChangeDate = (newDate) => {
        setSelectDate(newDate);
    };

    const handleChangeTime = (newTime) => {
        setSelectTime(newTime);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!selectDate || !selectTime) {
            console.error("Date and time must be selected");
            return;
        }

        const formattedDateTime = dayjs(`${selectDate.format('YYYY-MM-DD')} ${selectTime.format('HH:mm')}`).toISOString();

        const appointmentData = {
            name: name,
            email: email,
            datetime: formattedDateTime // Ensure datetime is a string in ISO format
        };

        setLoading(true); // Start loading state
        axios.post('http://192.168.0.104:5000/api/appointment', appointmentData) // Ensure IP is correct
            .then(response => {
                setMessage('Your appointment has been booked successfully!'); // Set success message
                // Clear the form fields
                setName('');
                setEmail('');
                setSelectDate(null);
                setSelectTime(null);
                setLoading(false); // End loading state
            })
            .catch(error => {
                console.error('Error saving appointment:', error); // Log full error
                setMessage('Failed to save appointment. Please try again.'); // Set error message
                setLoading(false); // End loading state
            });
    };

    return (
        <div className="Appointment">
            <div className="background-svg"></div>
            {/* 
            <nav>
                <ul>
                    <li><Link to='/'> Home</Link></li>
                    <li>
                        <Link to='/Appointment' className='home'>Appointment</Link>
                    </li>
                </ul>
            </nav> */}

            <form onSubmit={handleSubmit}>
                <label className="inputfiled">
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={handleChangeName}
                        placeholder="Enter your name"
                        required // Make it a required field
                    />
                </label>

                <label className="inputfiled">
                    Email:
                    <input
                        type="email"
                        value={email} // Bind email state
                        onChange={handleChangeEmail}
                        placeholder="Enter your email"
                        required // Make it a required field
                    />
                </label>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker
                            label="Select Date"
                            value={selectDate}
                            onChange={handleChangeDate}
                            required // Make it a required field
                        />
                    </DemoContainer>
                    <TimeClock
                        label="Select Time"
                        value={selectTime}
                        onChange={handleChangeTime}
                        required // Make it a required field
                    />
                </LocalizationProvider>

                <button type="submit" disabled={loading}>Submit</button>
            </form>

            {loading && <p>Loading...</p>} {/* Loading message */}
            {message && <p>{message}</p>} {/* Display success/error message */}
        </div>
    );
}
