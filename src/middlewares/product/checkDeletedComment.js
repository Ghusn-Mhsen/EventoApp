const ProductRepository = require('../../repositories/productRepository/product');
const CustomError = require('../../ErrorHandler/customError')
const statusCode = require('../../ErrorHandler/statusCode')
const ROLES = {
    ADMIN: 'admin',
    SUBER_ADMIN: 'superAdmin',
};
const checkDeletedComment = async (req, res, next) => {
    try {

        const productId = req.params.id
        const commentId = req.body.commentId;
        const userId = req._id;
        const role = req.role
        const isAdmin = role === ROLES.ADMIN;
        const isSuber_Admin = role === ROLES.SUBER_ADMIN;


        if (!productId || !commentId) {
            throw new CustomError('Incomplete data provided', statusCode.BadRequest)
        }

        const comment = await ProductRepository.getCommentById(productId, commentId);

        if (!comment) {
            throw new CustomError('Comment not found', statusCode.NotFound)
        }
        const {_id} = comment.user;

        if (userId.toString() ===  _id.toString() || isAdmin || isSuber_Admin) {

            next();
        } else {
            throw new CustomError('Permission denied', statusCode.Unauthorized)
        }
    } catch (error) {
       next(error)
    }
};
module.exports = checkDeletedComment;