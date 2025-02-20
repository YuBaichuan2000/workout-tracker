import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import validator from 'validator';

const { Schema } = mongoose;

const userSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        // required: true
    },
    // for google authentication
    googleId: {
        type: String
    },
    isVerified: Boolean,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date
})

// static signup method, regular function is needed when this keyword in use
userSchema.statics.signup = async function (email, password) {

    
    if (!email || !password) {
        throw Error('All fields must be filled');
    };

    // check if email and password are valid
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid.');
    };
    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough.');
    };


    // check if email exists
    const exists = await this.findOne({ email });
    
    if (exists) {
        throw Error('Email already in use.');
    };

    // add salt
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // verfication code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await this.create({ email, password: hash, verificationToken, isVerified: false, verificationTokenExpiresAt: Date.now()+60*60*1000}); // expires in one hour

    return user;

}

// static login method, regular function is needed when this keyword in use
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled');
    };

    // check if email exists
    const user = await this.findOne({ email });
    
    if (!user) {
        throw Error('Incorrect email or password');
    };

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error('Incorrect email or password');
    }

    return user;
}   

const User = mongoose.model('User', userSchema);

export default User;