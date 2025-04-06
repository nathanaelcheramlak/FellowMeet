import express from 'express';

import userRoute from './user.route.js';
import authRoute from './auth.route.js';
import prayerRoute from './prayer.route.js';
import announcementRoute from './announcement.route.js';

const app = express.Router();

app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/announcement', announcementRoute);
app.use('/prayer', prayerRoute);

export default app;