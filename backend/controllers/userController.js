import User from  '../models/userModels.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const createToken = (_id) => {
    return jwt.sign({_id: _id}, process.env.SECRET, {expiresIn: '1d'});
}

// login user
export const loginUser = async (req, res) => {
    
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        // create token
        const token = createToken(user._id);

        // set the token as http-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24*60*60*1000,
            sameSite: 'lax'
        })

        res.status(200).json({email});

    } catch (e) {
        res.status(400).json({error: e.message});
    }

};

// signup user
export const signupUser = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.signup(email, password);

        // create token
        const token = createToken(user._id);

        // Set the token as an HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: 'lax'
        });
    
        res.status(200).json({ email });

    } catch (e) {
        res.status(400).json({error: e.message});
    }

};

// logout user and clear cookie
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        res.status(200).json({msg: 'Logout sucessful'});
    } catch (e) {
        res.status(400).json({error: e.message});
    }
    
}
