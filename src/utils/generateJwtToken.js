require('dotenv').config();
const jwt = require("jsonwebtoken");


const generateJwtToken = (user, role)=> {
    const {_id } = user;
    const SECRET = process.env.SECRET;
    let payload = {_id: _id, role: role};

    return jwt.sign(payload,SECRET);
}
module.exports = generateJwtToken;