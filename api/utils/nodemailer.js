// utils/nodemailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "skyactvn@gmail.com",
    pass: "fohx mszt qfwq kqxz",
  },
});

export default transporter;
