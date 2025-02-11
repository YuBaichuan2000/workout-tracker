import mongoose from "mongoose";
import bcrypt from 'bcrypt';
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