const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendApprovalEmail = async (email) => {
  await transporter.sendMail({
    from: `"Admin" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "New User Signup - Manual Approval Required",
    html: `<p>A new user signed up with email: <b>${email}</b></p>
           <p>Go to the database to approve.</p>`,
  });
};

module.exports = sendApprovalEmail;
