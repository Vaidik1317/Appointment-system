const nodemailer = require("nodemailer");

// Setup nodemailer transporter with hardcoded credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "221243107010.ce@gmail.com", // Hardcoded email address
    pass: "bilimora123", // Hardcoded password
  },
  logger: true, // Log information about the transport process
  debug: true, // Show debug output
});

// Function to send email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: "221243107010.ce@gmail.com", // Hardcoded email address
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = { sendEmail };
