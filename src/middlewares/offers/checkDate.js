const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')

function checkDateValidity(req, res, next) {
    try {
        const {
            startDateOfOffers,
            endDateOfOffers
        } = req.body;

        if (!(new Date(startDateOfOffers).getTime() < new Date(endDateOfOffers).getTime())) {
            throw new CustomError('Start date must be less than end date.', statusCode.BadRequest)
        }

        next();
    } catch (error) {
        next(error)
    }
}

module.exports = checkDateValidity;
