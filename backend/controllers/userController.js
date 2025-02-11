import User from  '../models/userModels.js';
import jwt from 'jsonwebtoken';

const createToken = (_id) => {
    return jwt.sign({_id: _id}, process.env.SECRET, {expiresIn: '1d'});
}

// login user
export const loginUser = async (req, res) => {
    res.json({msg: 'login user'});
};

// signup user
export const signupUser = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.signup(email, password);

        // create token
        const token = createToken(user._id);

        res.status(200).json({email, token});

    } catch (e) {
        res.status(400).json({error: e.message});
    }

};
