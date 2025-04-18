import Joi from 'joi';

export const announcementSchema = Joi.object({
    authorId: Joi.string().required(),
    title: Joi.string().max(100).min(2).required(),
    body: Joi.string().max(500).required(),
    tags: Joi.array().items(Joi.string()).optional(),
    images: Joi.array().items(Joi.string().uri()).optional()
});

export const updateAnnouncementSchema = Joi.object({
    title: Joi.string().max(100).min(2).optional(),
    body: Joi.string().max(500).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    images: Joi.array().items(Joi.string().uri()).optional()
});