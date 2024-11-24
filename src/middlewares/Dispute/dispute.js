const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')
const checkDisputeStatus = (req, res, next) => {
    try {
        const {
            status
        } = req.body;

        if (status && (status === 'rejected' || status === 'resolved')) {
            next();
        } else {
            throw new CustomError(`Invalid dispute status. Allowed values are 'rejected' or 'resolved'.`, statusCode.BadRequest)
        }
    } catch (error) {
        next(error)
    }
};

module.exports = checkDisputeStatus;
