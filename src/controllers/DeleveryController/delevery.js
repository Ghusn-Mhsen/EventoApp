const DeleveryRepositories = require('../../repositories/DeleveryRepositories/delevery');
const response = require('../../utils/response');

class DeleveryController {
    async addDeleverycost(req, res, next) {
        try {
            const { from, to, cost } = req.body;
            const data = { from, to, cost }
            const result = await DeleveryRepositories.addDeleverycost(data);

            return response(res, 200, {
                message: 'Delevery cost added successfully',
                result
            });
        } catch (error) {
            next(error)
        }
    }

    async getAllDeleveryCost(req, res, next) {
        try {

            let limit = 10;
            let page = parseInt(req.query.page) || 1;
            let offset = (page - 1) * limit;

            const result = await DeleveryRepositories.getAllDeleverycost(offset);
            return response(res, 200, {
                message: 'Delevery cost retrieved successfully',
                result
            });
        } catch (error) {
            next(error)
        }
    }

    async deleteDeleveryCost(req, res, next) {
        try {
            const id = req.params.id;
            const result = await DeleveryRepositories.deleteDeleverycostById(id);

            return response(res, 200, {
                message: 'Delevery cost deleted successfully',
                result
            });
        } catch (error) {
            next(error)
        }
    }
    async updateDeleveryCost(req, res, next) {
        try {
            const { id } = req.params;
            const { from, to, cost } = req.body;
            const data = { from, to, cost }
            const updatedAboutUs = await DeleveryRepositories.updateDeleverycost(id, data);

            return response(res, 200, {
                message: 'Delevery cost updated successfully',
                result: updatedAboutUs,
            });
        } catch (error) {
            next(error)
        }
    }
    async getDeleveryCostById(req, res, next) {
        try {
            const { id } = req.params;
            const DeleveryCost = await DeleveryRepositories.getDeleverycostById(id);

            return response(res, 200, {
                message: 'get Delevery cost successfully',
                result: DeleveryCost,
            });
        } catch (error) {
            next(error)
        }
    }
    async getCost(req, res, next) {
        try {
            const { totalPrice } = req.body;
            const  cost  = await DeleveryRepositories.getCost(totalPrice);
            
            

            return response(res, 200, {
                message: 'get cost successfully',
                result: cost,
            });
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new DeleveryController();