import User from '../models/user.js';

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'getUser => User not found.' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log('Error in getUser Controller: ', error);
    res.status(500).json({ error: 'Internal Server Error!' });
  }
};

export const createUser = async (req, res) => {
  console.log('Create User initiated.');
  try {
    const usr_id = req.user._id;
    const {
      team,
      region,
      batch,
      dateOfBirth,
      department,
      churchName,
      bio,
      favVerse,
      phone,
      image,
    } = req.body;

    const user = await User.findById(usr_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (team) user.team = team;
    if (region) user.region = region;
    if (batch) user.batch = batch;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (department) user.department = department;
    if (churchName) user.churchName = churchName;
    if (bio) user.bio = bio;
    if (favVerse) user.favVerse = favVerse;
    if (phone) user.phone = phone;
    if (image) user.image = image;

    const updatedUser = await user.save();
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log('Error in createUser controller: ', error);
    res.status(500).json({ error: 'Failed to save user data' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.log('Error in getAllUsers controller: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.user._id;
  const {
    fullName,
    email,
    password,
    team,
    region,
    batch,
    dateOfBirth,
    department,
    churchName,
    bio,
    favVerse,
    phone,
    image,
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (password) user.password = password;
    if (team) user.team = team;
    if (region) user.region = region;
    if (batch) user.batch = batch;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (department) user.department = department;
    if (churchName) user.churchName = churchName;
    if (bio) user.bio = bio;
    if (favVerse) user.favVerse = favVerse;
    if (phone) user.phone = phone;
    if (image) user.image = image;

    const updatedUser = await user.save();
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log('Error in updateUser controller: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId); // Corrected: added await and findById
    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.log('Error in deleteUser controller: ', error);
    res.status(500).json({ error: 'Internal Server Error' }); // Corrected typo
  }
};

export const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      res
        .status(404)
        .json({ error: 'No Image Provided or Something went wrong.' });
    }
    const ImageUrl = req.file?.path;
    res.status(200).json({ ImageUrl });
  } catch (error) {
    console.log('Image upload error: ', error);
    res.status(500).json({ error: 'Internal Server Error!' });
  }
};
