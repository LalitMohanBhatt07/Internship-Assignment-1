const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();


const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333; }
          .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
          h1 { color: #4CAF50; font-size: 24px; text-align: center; }
          p { font-size: 16px; line-height: 1.5; }
          .otp-box { background-color: #f9f9f9; padding: 10px 20px; margin: 20px 0; font-size: 22px; letter-spacing: 2px; font-weight: bold; text-align: center; border: 2px dashed #4CAF50; border-radius: 8px; }
          .button-container { text-align: center; margin-top: 30px; }
          .verify-button { background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block; }
          .footer { text-align: center; font-size: 14px; color: #888; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Your OTP Code</h1>
          <p>Hello,</p>
          <p>We received a request to verify your account. Use the following One-Time Password (OTP) to complete the process:</p>
          <div class="otp-box">${otp}</div>
          <p>This OTP is valid for the next 10 minutes. Please do not share this code with anyone.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <div class="footer">
            <p>Thank you for choosing us!</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};


exports.signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, contactNumber } = req.body;
    const otp = generateOTP();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      passwordHash: password,
      otp,
      contactNumber,
    });

    await newUser.save();
    await sendOTP(email, otp);

    res.status(201).json({
      message: 'User registered successfully. OTP sent to email.',
      newUser
     });
  } catch (error) {
    res.status(500).json({ message: 'Sign-up failed', error: error.message });
  }
};


exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  user.isVerified = true;
  await user.save();

  res.status(200).json({ message: 'OTP verified, account activated.' });
};


exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Account not verified. Check your email for OTP.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Sign-in successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Sign-in failed', error: error.message });
  }
};


exports.signOut = (req, res) => {
  res.status(200).json({ message: 'Sign-out successful' });
};



