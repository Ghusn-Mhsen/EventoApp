const disputeRepository = require("../../repositories/DisputeRepositories/dispute");
const response = require("../../utils/response");
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')

class DisputeController {
    async addDispute(req, res,next) {
        try {
            const {
                firstName,
                lastName,
                email,
                message
            } = req.body;
            const {
                disputeImage
            } = req.files;

            // Check if disputeImage is uploaded
            if (!disputeImage || !disputeImage[0] || !disputeImage[0].filename) {
                throw new CustomError('Dispute image is required',statusCode.BadRequest)
            }

            const disputeObj = {
                firstName,
                lastName,
                email,
                message,
                disputeImage: `dispute/${disputeImage[0].filename}`,
            };

            // Create dispute using repository
            const result = await disputeRepository.create(disputeObj);

            return response(res, 200, {
                message: "Add Dispute Successfully",
                result
            });
        } catch (error) {
          next(error)
        }
    }
    async getDispute(req, res,next) {
        try {
            const {
                id
            } = req.params;
            const result = await disputeRepository.getDisputeByID(id);

            return response(res, 200, {
                message: "Get Dispute Successfully",
                result
            });

        } catch (error) {
            next(error)
          }
    }

    async deleteDispute(req, res,next) {
        try {
            const id = req.params.id;

            let result = await disputeRepository.deleteDisputeByID(id);
            return response(res, 200, {
                message: "Delete Dispute Successfully",
                result
            });
        } catch (error) {
            next(error)
          }
    }
    async searchForDispute(req, res,next) {
        try {
            const {
                message
            } = req.query;

            let result = await disputeRepository.searchForDispute(message);
            return response(res, 200, {
                message: `get Disputes Successfully`,
                result
            });
        } catch (error) {
            next(error)
          }
    }

    async ChangeDisputeStatus(req, res,next) {
        try {
            const id = req.params.id;
            const {
                status
            } = req.body

            let result = await disputeRepository.ChangeDisputeStatus(id, status);
            
            return response(res, 200, {
                message: `Change Dispute Status Successfully`,
                result
            });
        } catch (error) {
            next(error)
          }
    }
    async getAllDispute(req, res,next) {
        try {

            let limit = 10;
            let page = parseInt(req.query.page) || 1;
            let offset = (page - 1) * limit;

            let result = await disputeRepository.getAllDispute(offset);


            return response(res, 200, {
                message: "get All Dispute Successfully",
                result
            });

        } catch (error) {
            next(error)
          }
    }

    async getDisputesByEmail(req, res,next) {
        try {
            const { email } = req.body;
            
            const result = await disputeRepository.getDisputesByEmail(email);
            return response(res, 200, {
                message: "Get Disputes By Email Successfully",
                result
            });
        } catch (error) {
            next(error)
          }
    }
    




}
module.exports = new DisputeController();