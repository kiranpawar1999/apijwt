import express from 'express';
import userModel from '../models/user.models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import  dotEnv from 'dotenv';
dotEnv.config();

const router = express.Router();

// REGISTER API
router.post('/register', async (req, res) => {
try{
const {username, email, password} = req.body;
let exitUser = await userModel.findOne({$or: [{username},{email}]
});
if (exitUser) return res.status(404).json({message: 'Username and Email already exist'});

let newPassword = await bcrypt.hash(password, 10);
const user = new userModel({username, email, password: newPassword})
const userSave = await user.save();
res.json(userSave);
}catch (error) {
 res.status(500).json({message: error.message });
}
});




// LOGIN API

router.post('/login', async (req, res) => {
    try{
        const {username, password} = req.body;

         const user = await userModel.findOne({username});
        if(!user) return res.status(404).json({ message: "User Not Found"});

        const userPassword = await bcrypt.compare(password, user.password);
        if(!password)  return res.status(404).json({message: "Password Are Not Match"});

        const jwtToken = jwt.sign(
            {userId: user._id, username: user.username},
            process.env.JWT_SECRET,
        {expiresIn : "1h" }  
          )
          res.json({jwtToken});


        // res.json("Login Successfully");
    } catch (error) {
        res.status(500).json({message: error.message});

    }
});

//LOGOUT API

router.post('/Logout', async (req, res) => {
    res.json({message: "Loggout Successfully"});

});

export default router;
