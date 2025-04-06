import Joi from 'joi';

export const createPrayerSchema = new Joi.object({
    user_id: Joi.string().required(),
    is_anonymous: Joi.boolean().optional(),

    title: Joi.string().max(100).min(2).required(),
    body: Joi.string().max(500).required(),
    is_open: Joi.boolean().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    prayer_count: Joi.number().optional(),
});

export const updatePrayerSchema = new Joi.object({
    title: Joi.string().max(100).min(2).optional(),
    is_anonymous: Joi.boolean().optional(),
    body: Joi.string().max(500).optional(),
    is_open: Joi.boolean().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
})