import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized - No Token Provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Unauthorized - Invalid Token' });
    }

    const user = await User.findById(decoded.userId).select('id fullname email role');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Unknown user' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('error in auth middleware: ', error);
    return res.status(500).json({ success: false, message: 'Internal server error!', error });
  }
};

export default authMiddleware;
