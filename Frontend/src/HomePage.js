import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const sendEmail = () => {
    axios
      .post("http://localhost:5000/api/send-email", {
        to: "user@example.com", // Add the email address of the user here
        subject: "Appointment Confirmation",
        text: "Your appointment has been booked successfully!",
      })
      .then((response) => console.log("Email sent:", response))
      .catch((error) => console.error("Error sending email:", error));
  };

  return (
    <div className="HomePage">
      <nav>
        <ul>
          <li>Home</li>
          <li className="home">Appiontment</li>
        </ul>
      </nav>

      <div className="leftContainer">
        <div className="text">
          <p className="L2"> Get Ready for Your </p>{" "}
          <p id="green"> Make Over </p>
          <p id="btn">
            {" "}
            <Link to="/Appointment" onClick={sendEmail}>
              Book Your Appointment Today
            </Link>
          </p>
        </div>
      </div>
      <div className="LowerContainer"></div>
    </div>
  );
};

export default HomePage;
