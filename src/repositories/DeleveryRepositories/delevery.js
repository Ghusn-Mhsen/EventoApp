const Deleverycost = require('../../models/delevery/delevery');
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')

class AboutUSRepository {
    async addDeleverycost(data) {
        try {
            return await Deleverycost.create(data);
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async getAllDeleverycost(offset) {
        try {
            const deleverycost = await Deleverycost.find({}).skip(offset).limit(10);
            return deleverycost || [];
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async deleteDeleverycostById(id) {
        try {
            const deleverycost = await Deleverycost.findByIdAndDelete(id);
            if (!deleverycost) {
                throw new CustomError('Delevery cost not found', statusCode.NotFound);
            }
            return deleverycost;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }
    async updateDeleverycost(id, data) {
        try {
            const deleverycost = await Deleverycost.findByIdAndUpdate(id, data, { new: true });

            if (!deleverycost) {
                throw new CustomError('Delevery cost not found', statusCode.NotFound);
            }

            return deleverycost;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }
    async getDeleverycostById(deleverycostID) {
        try {
            const deleverycost = await Deleverycost.findById(deleverycostID);

            if (!deleverycost) {
                throw new CustomError("Delevery cost Not Found", statusCode.NotFound)
            }
            return deleverycost;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async getCost(totalPrice) {
        try {
            const result = await Deleverycost.findOne({
                $and: [
                    { from: { $lte: totalPrice } },
                    { to: { $gte: totalPrice } }
                ]
            });
            if (!result) {
                return 0;
            }
            const { cost } = result


            return cost;
        } catch (error) {
            throw new CustomError(error.message, error.statusCode);
        }
    }
}

module.exports = new AboutUSRepository();
