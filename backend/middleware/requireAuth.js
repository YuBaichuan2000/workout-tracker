import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

const requireAuth = async (req, res, next) => {

    // verify authentication
    // const { authorization } = req.headers;

    const token = req.cookies.token;


    // if (!authorization) {
    //     return res.status(401).json({error: 'Authorization token required'});
    // }

    if (!token) {
        return res.status(401).json({error: 'Authorization token required'});
    }

    // get the jwt token
    // const token = authorization.split(' ')[1];

    try {
        const {_id} = jwt.verify(token, process.env.SECRET);
        // attach user property to req and hand it to next middleware
        req.user = await User.findOne({_id}).select('_id');
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({error: 'Request is not authorized'});
    }


}
 
export default requireAuth;