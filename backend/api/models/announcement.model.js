import { Schema, model } from 'mongoose';

const announcementSchema = new Schema({
    author: { type: Schema.Types.ObjectId },
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: { type: [String] },
    images: { type: [String] },
    like_count: { type: Number, default: 0 },
}, { timestamps:  true });

const Announcement = model('Announcement', announcementSchema);
export default Announcement;