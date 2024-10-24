const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sendEmail } = require("./mailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose.connect("mongodb://localhost:27017/appointments", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Appointment schema
const AppointmentSchema = new mongoose.Schema({
  name: String,
  email: String, // User email
  datetime: Date,
  status: { type: String, default: "pending" },
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);

// Route to fetch all appointments
app.get("/api/appointments", (req, res) => {
  Appointment.find()
    .then((appointments) => res.status(200).json(appointments))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Route to create a new appointment
app.post("/api/appointment", (req, res) => {
  const newAppointment = new Appointment(req.body);
  newAppointment
    .save()
    .then((savedAppointment) => res.status(201).json(savedAppointment))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Route to accept an appointment
app.put("/api/appointments/accept/:id", (req, res) => {
  const appointmentId = req.params.id;

  Appointment.findByIdAndUpdate(
    appointmentId,
    { status: "accepted" },
    { new: true }
  )
    .then((updatedAppointment) => {
      if (!updatedAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      // Send email notification
      sendEmail(
        updatedAppointment.email, // Using email from appointment
        "Appointment Accepted",
        `Your appointment on ${updatedAppointment.datetime} has been accepted.`
      );

      res.status(200).json(updatedAppointment);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
