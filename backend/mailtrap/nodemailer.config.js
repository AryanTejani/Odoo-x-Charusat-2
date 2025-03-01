import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "Loaded" : "Not Loaded");
// Create a transporter using SMTP or other service
export const transporter = nodemailer.createTransport({
  service: 'gmail', // or any other service like 'outlook', 'yahoo', etc.
  // If not using a service, specify SMTP details:
  // host: 'smtp.yourprovider.com',
  // port: 587,
  // secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // Use an app password if using Gmail
  }
});

export const sender = {
  email: process.env.EMAIL_USER,
  name: "Calorie Sensei"
};