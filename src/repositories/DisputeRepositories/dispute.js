const dispute = require("../../models/Dispute/dispute");

class disputeRepository {
    async create(disputeObj) {
        try {
            const newDispute = await dispute.create(disputeObj);

            return newDispute;
        } catch (error) {
            throw new CustomError(error.message,error.statusCode)
        }
    }

    async getDisputeByID(disputeId) {
        try {
            const foundDispute = await dispute.findOne({
                _id: disputeId
            });

            if (!foundDispute) {
                throw new CustomError('Dispute Not found.',statusCode.NotFound)
            }

            return foundDispute;
        }  catch (error) {
            throw new CustomError(error.message,error.statusCode)
        }
    }
    async getDisputesByEmail(email) {
        try {

            const disputes = await dispute.find({ email });
    
    
            return disputes || [];
        }  catch (error) {
            throw new CustomError(error.message,error.statusCode)
        }
    }
    
    async deleteDisputeByID(disputeId) {
        try {
            const deletedDispute = await dispute.findOneAndDelete({
                _id: disputeId
            })

            if (!deletedDispute) {
                throw new CustomError('Dispute Not found.',statusCode.NotFound)
            }

            return deletedDispute;
        }  catch (error) {
            throw new CustomError(error.message,error.statusCode)
        }
    }

    async searchForDispute(message) {
        try {
            const query = {
                message: {
                    $regex: message,
                    $options: "i",
                },
            };

            const searchResults = await dispute.find(query);

          
            return searchResults || [];
        }  catch (error) {
            throw new CustomError(error.message,error.statusCode)
        }
    }

    async getAllDispute(offset) {
        try {
            const limit = 10;
            const disputes = await dispute.find().skip(offset).limit(limit);
    
           
    
            return disputes || [];
        }  catch (error) {
            throw new CustomError(error.message,error.statusCode)
        }
    }
    

    async ChangeDisputeStatus(id, status) {
        try {
            const updateResult = await dispute.updateMany({
                _id: id
            }, {
                $set: {
                    status: status,
                },
            });

            if (!updateResult) {
                throw new CustomError('Dispute Not found.',statusCode.NotFound)
            }


            return await this.getDisputeByID(id);
        }  catch (error) {
            throw new CustomError(error.message,error.statusCode)
        }
    }


}

module.exports = new disputeRepository();