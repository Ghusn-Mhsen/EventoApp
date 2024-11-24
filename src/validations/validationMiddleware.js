const CustomError = require('../ErrorHandler/customError');
const statusCode = require('../ErrorHandler/statusCode');

const middleware = (schema, property) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property]);

        const valid = error == null;
        if (valid) {
            next();
        } else {

            const { details } = error;
            const message = details.map(i => i.message).join(',');
            
            throw new CustomError(message, statusCode.BadRequest);
        }
    };
};

module.exports = middleware;

