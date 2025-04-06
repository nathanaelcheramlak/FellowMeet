import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

import User from '../models/user.model.js';
import sendEmail from '../utils/sendEmail.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    const user = await User.findOne({ $or: [{email}, {phone}] });
    if (user) {
      return res.status(400).json({ success: false, message: 'user already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    // Email Verififcation
    const token = crypto.randomBytes(32).toString('hex');
    newUser.emailVerificationToken = token;

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    await sendEmail(newUser.email, 'Email Verification', 'verification', verificationLink);

    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: newUser._id,
        fullName: newUser.fullname,
        email: newUser.email,
      }
    });
  } catch (error) {
    console.log('Error in register controller:', error);
    return res.status(500).json({ error: 'Internal Server Error.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'No User found. Try signing in' });
    }

    const ispwdCorrect = await bcrypt.compare(password, user.password);
    if (!ispwdCorrect) {
      return res.status(400).json({ error: 'Invalid Credentials.' });
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    });
  } catch (error) {
    console.log('Error in login controller: ', error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie('jwt', '', {
      maxAge: 0,
      sameSite: 'none',
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log('Error in logout controller: ', error);
    res.status(500).json({ error: 'Internal Server Error.!' });
  }
};

export const me = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error in token verification:', error.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const token = req.query;
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.log('Error in verifyEmail controller:', error);
    return res.status(500).json({ error: 'Internal Server Error.' });
  }
}