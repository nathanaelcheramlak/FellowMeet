import Joi from 'joi';

export const registerSchema = Joi.object({
    fullname: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required().trim(),
    phone: Joi.string().required().trim(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin', 'leader').optional(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().min(6).required(),
});
