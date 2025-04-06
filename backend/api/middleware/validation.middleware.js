import Joi from 'joi';

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        const errorMessage = error.details.map((detail) => detail.message.replace(/\"/g, ''));
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            error: errorMessage,
        })
    }
    next();
}

export default validate;