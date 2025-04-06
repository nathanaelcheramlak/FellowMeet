import User from '../models/user.model.js';

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires -emailVerificationToken -emailVerified');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, message: 'User found', user});
  } catch (error) {
    console.log('Error in getUser Controller: ', error);
    return res.status(500).json({ success: false, message: 'Internal server error!', error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder, search } = req.query;
    const filters = {
      ... (req.query.department && {department: req.query.department}),
      ... (req.query.batch && {batch: req.query.batch}),
    };

    // Pagination
    const pageNumber = Math.max(parseInt(page) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(limit) || 10, 1), 100); // Limit to 1 - 100
    const skip = (pageNumber - 1) * pageSize;

    // Sorting
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; 
    }

    // Search
    if (search) {
      filters.$or = [
        { fullname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, userCount] = await Promise.all([
      User.find(filters)
        .select('-password -resetPasswordToken -resetPasswordExpires -emailVerificationToken -emailVerified')
        .skip(skip)
        .limit(pageSize)
        .sort(sort)
        .lean(),
      User.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(userCount / pageSize);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalUsers: userCount,
        itemsPerPage: pageSize,
      },
    })

  } catch (error) {
    console.log('Error in getAllUsers controller: ', error);
    return res.status(500).json({ success: false, message: 'Internal server error!', error });
  }
};

export const getStarted = async (req, res) => {
  const userId = req.user._id;
  const allowedFields = [
    'profile_picture',
    'date_of_birth',
    'batch',
    'region',
    'phone',
    'university_id',
    'department',
    'bio',
    'hobbies',
    'church_name',
    'favorite_verse',
    'fellowship_team',
    'favorite_artist',
    'favorite_book',
    'favorite_music',
  ];
  try {
    const updateFields = Object.keys(req.body);
    const user = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires -emailVerificationToken -emailVerified');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }

    for (const field of allowedFields) {
      if (updateFields.includes(field)) {
        user[field] = req.body[field];
      }
    }

    await user.validate();
    const updatedUser = await user.save();

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log('Error in getUserInfo controller: ', error);
    return res.status(500).json({ success: false, message: 'Internal server error!', error });
  }
}

export const updateUser = async (req, res) => {
  const userId = req.user._id;
  const allowedFields = [
    'department',
    'bio',
    'hobbies',
    'church_name',
    'favorite_verse',
    'fellowship_team',
    'favorite_artist',
    'favorite_book',
    'favorite_music',
  ];

  try {
    const updateFields = Object.keys(req.body);
    const user = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires -emailVerificationToken -emailVerified');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }

    // Check if the fields to be updated are allowed
    for (const field of allowedFields) {
      if (updateFields.includes(field)) {
        user[field] = req.body[field];
      }
    }

    await user.validate();
    const updatedUser = await user.save();

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log('Error in updateUser controller: ', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({ success: false, message: 'Internal server error!', error });
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const image_url = req.body.image_url;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.profile_picture = image_url;
    await user.validate();
    const updatedProfile = await user.save();

    return res.status(200).json({ success: true, message: 'User profile updated', user: updateProfile })
  } catch (error) {
    console.error('Error in updateProfile controller: ', error);
    return res.status(500).json({ success: false, message: 'Internal server error!', error });
  }
}

export const deleteUser = async (req, res) => {
  const userId = req.user._id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }
    return res.status(200).json({ success: true, message: 'User deleted successfully.', user: deletedUser });
  } catch (error) {
    console.log('Error in deleteUser controller: ', error);
    return res.status(500).json({ success: false, message: 'Internal server error!', error });
  }
};

export const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      res
        .status(404)
        .json({ success: false, message: 'No image provided or something went wrong.' });
    }
    const ImageUrl = req.file?.path;
    res.status(200).json({ success: true, url:ImageUrl });
  } catch (error) {
    console.log('Image upload error: ', error);
    return res.status(500).json({ success: false, message: 'Internal server error!', error });
  }
};
