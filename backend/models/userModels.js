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
        required: true
    }
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

    const user = await this.create({ email, password: hash });

    return user;

}

const User = mongoose.model('User', userSchema);

export default User;