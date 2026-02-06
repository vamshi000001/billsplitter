const Joi = require("joi");

exports.registerSchema = Joi.object({
    roomName: Joi.string().min(3).required(),
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});


exports.loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

exports.roommateLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
