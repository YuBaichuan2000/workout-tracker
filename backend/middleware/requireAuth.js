import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

const requireAuth = async (req, res, next) => {
    console.log('Cookie received:', req.cookies);
    const token = req.cookies.token;

    if (!token) {
        console.log('No token found in cookies');
        return res.status(401).json({error: 'Authorization token required'});
    }

    try {
        console.log('Attempting to verify token');
        const {_id} = jwt.verify(token, process.env.SECRET);
        console.log('Token verified, user id:', _id);
        
        const user = await User.findOne({_id}).select('_id');
        if (!user) {
            console.log('User not found for id:', _id);
            return res.status(401).json({error: 'User not found'});
        }
        
        req.user = user;
        console.log('User authenticated:', _id);
        next();

    } catch (error) {
        console.log('Token verification failed:', error.message);
        res.status(401).json({error: 'Request is not authorized'});
    }
}
 
export default requireAuth;