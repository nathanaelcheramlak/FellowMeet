import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date },
    department: { type: String },
    batch: { type: Number },
    churchName: { type: String },
    favVerse: { type: String },
    bio: { type: String },
    image: { type: String },
    team: { type: String },
    region: { type: String },
    phone: { type: String },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);
export default User;
