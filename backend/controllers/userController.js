import User from  '../models/userModels.js';


// login user
export const loginUser = async (req, res) => {
    res.json({msg: 'login user'});
};

// signup user
export const signupUser = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.signup(email, password);
        res.status(200).json({email, user});
    } catch (e) {
        res.status(400).json({error: e.message});
    }

};
