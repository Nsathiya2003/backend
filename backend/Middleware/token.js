import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();



export const generateAccessToken = (cmp) => {
  console.log("secretKey", process.env.JWT_SECRET);
  console.log("expiresIn", process.env.EXPIRES_IN);

  console.log("Payload:", cmp);
  try {
    const token = jwt.sign(cmp, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN });
    console.log("Generated Token:", token);
    return token;
  } catch (error) {
    console.error("Error generating token:", error); 
    throw new Error("Token generation failed");
  }
};

export const generateOTP = () => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 5; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOTP = async (to, otp) => {
  const mailOptions = {
    from: 'nsathiya757@gmail.com',
    to,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);  
    console.log('OTP sent');
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};