import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_picture: { type: String },
    role: { type: String, default: 'user'},

    // Additional Info
    date_of_birth: { type: Date },
    department: { type: String },
    batch: { type: Number },
    bio: { type: String },
    region: { type: String },
    hobbies: { type: [String] },
    university_id: { type: String },

    // Religous Info
    church_name: { type: String },
    favorite_verse: { type: String },
    fellowship_team: { type: String },
    favorite_artist: { type: String },
    favorite_book: { type: String },
    favorite_music: { type: String },

    // Auth
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);
export default User;
