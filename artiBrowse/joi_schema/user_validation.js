//requiring joi
const joi = require("joi");


module.exports.userValidate = joi.object({
    email: joi.string().min(5).max(40).required().regex(/[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+/),
    username: joi.string().min(5).max(40).required(),
    password: joi.string().min(5).max(40).required()
});
module.exports.userName = joi.string().min(5).max(40).required();