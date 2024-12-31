import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match." });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
    });
  } catch (error) {
    console.log('Error in signup controller:', error);
    res.status(500).json({ error: 'Internal Server Error.' });
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
      sameSite: 'strict',
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log('Error in logout controller: ', error);
    res.status(500).json({ error: 'Internal Server Error.!' });
  }
};

export const verify = async (req, res) => {
  try {
    const token = req.cookies['jwt'];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select(
      '_id fullName email image bio',
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error in token verification:', error.message);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};
