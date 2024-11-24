const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let validator = require("validator");
let timestampPlugin = require("../../utils/plugins/timestamp");
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: (value) => {
            return validator.isEmail(value);
        },
    },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin','manufacturer','superAdmin'],
        default: 'user',
    },
    otp_code:{
        type: String,
        select: false,
    },
    otp_expiration:{
        type: Date,
        select: false,
    },
    is_verified:{
        type: Boolean,
        default:false,
        select: false,
        
    }
});

UserSchema.pre("save", async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

UserSchema.plugin(timestampPlugin);
module.exports = mongoose.model("User", UserSchema);