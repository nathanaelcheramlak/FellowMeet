import Joi from 'joi';

export const updateUserSchema = Joi.object({
    department: Joi.string().optional(),
    bio: Joi.string().optional(),
    hobbies: Joi.array().items(Joi.string()).optional(),
    church_name: Joi.string().optional(),
    favorite_verse: Joi.string().optional(),
    fellowship_team: Joi.string().optional(),
    favorite_artist: Joi.string().optional(),
    favorite_book: Joi.string().optional(),
    favorite_music: Joi.string().optional(),
});

export const getStartedSchema = Joi.object({
    profile_picture: Joi.string().optional(),
    date_of_birth: Joi.date().optional(),
    batch: Joi.number().optional(),
    region: Joi.string().optional(),
    phone: Joi.string().optional(),
    university_id: Joi.string().optional(),
    department: Joi.string().optional(),
    bio: Joi.string().optional(),
    hobbies: Joi.array().items(Joi.string()).optional(),
    church_name: Joi.string().optional(),
    favorite_verse: Joi.string().optional(),
    fellowship_team: Joi.string().optional(),
    favorite_artist: Joi.string().optional(),
    favorite_book: Joi.string().optional(),
    favorite_music: Joi.string().optional(),
});