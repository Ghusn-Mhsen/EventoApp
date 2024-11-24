const influencerRepository = require('../../repositories/influencerRepositories/influencer'); // Adjust the path accordingly
const response = require("../../utils/response")
class InfluencerController {
    async addInfluencer(req, res,next) {
        try {
            const {
                name,
                email,
                phoneNumber,
                region
            } = req.body;


            const influencerData = {
                name,
                email,
                phoneNumber,
                region
            }

            const newInfluencer = await influencerRepository.addInfluencer(influencerData);
            return response(res, 200, {
                message: "Add Influencer Successfully",
                result: newInfluencer
            })
        } catch (error) {
           next(error)
        }
    }

    async deleteInfluencer(req, res,next) {
        try {
            const influencerId = req.params.id;
            const deletedInfluencer = await influencerRepository.deleteInfluencerById(influencerId);
            return response(res, 200, {
                message: "delete Influencer Successfully"
            })
        } catch (error) {
            next(error)
         }
    }

    async updateInfluencer(req, res,next) {
        try {
            const influencerId = req.params.id;
            const {
                name,
                email,
                phoneNumber,
                region
            } = req.body;

            const updatedData = {
                name,
                email,
                phoneNumber,
                region
            }
            const updatedInfluencer = await influencerRepository.updateInfluencer(influencerId, updatedData);
            return response(res, 200, {
                message: "Update Influencer Successfully",
                result: updatedInfluencer
            })
        } catch (error) {
            next(error)
         }
    }

    async getInfluencerById(req, res,next) {
        try {
            const influencerId = req.params.id;
            const influencer = await influencerRepository.getInfluencerById(influencerId);
            return response(res, 200, {
                message: "Get Influencer By ID  Successfully",
                result: influencer
            })
        } catch (error) {
            next(error)
         }
    }

    async getAllInfluencesSortedByRating(req, res,next) {
        try {
            const influences = await influencerRepository.getAllInfluencesSortedByRating();
            return response(res, 200, {
                message: "Get All Influences Successfully",
                result: influences
            })
        } catch (error) {
            next(error)
         }
    }

    async addRating(req, res,next) {
        try {
            const influencerId = req.params.id;
            const user = req._id;
            const {
                rating
            } = req.body;

            const Data = {
                rating,
                user
            };

            const result = await influencerRepository.addRating(influencerId,Data);
                return response(res, 200, {
                    message: 'Rating added successfully'
                });
        } catch (error) {
            next(error)
         }
    }
}

module.exports = new InfluencerController();