import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true,
        unique: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    createAt:{
        type: Date,
        default: Date.now
    }
});

let userModel = mongoose.model('JWTusers', userSchema);

export default userModel;