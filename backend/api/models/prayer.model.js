import { Schema, model } from 'mongoose';

const prayerSchema = new Schema({
    // User Data
    user_id: { type: Schema.Types.ObjectId, required: true },
    is_anonymous: { type: Boolean, default: false },

    // Prayer
    title: { type: String, required: true },
    body: { type: String, required: true },
    is_open: { type: String, default: true },
    tags: { type: [String] },
    prayer_count: { type: Number, default: 0},
}, { timestamps:  true });

const Prayer = model('Prayer', prayerSchema);
export default Prayer;