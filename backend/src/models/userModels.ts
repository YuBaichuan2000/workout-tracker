import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from 'bcrypt';
import validator from 'validator';

// Interface for User document
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    password?: string;
    googleId?: string;
    isVerified: boolean;
    resetPasswordToken?: string;
    resetPasswordExpiresAt?: Date;
    verificationToken?: string;
    verificationTokenExpiresAt?: Date;
}

// Interface for User model with static methods
interface IUserModel extends Model<IUser> {
    signup(email: string, password: string): Promise<IUser>;
    login(email: string, password: string): Promise<IUser>;
}

const userSchema: Schema = new Schema({
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
});

// static signup method
userSchema.statics.signup = async function (email: string, password: string): Promise<IUser> {
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    // check if email and password are valid
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid.');
    }
    
    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough.');
    }

    // check if email exists
    const exists = await this.findOne({ email });
    
    if (exists) {
        throw Error('Email already in use.');
    }

    // add salt
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await this.create({ 
        email, 
        password: hash, 
        verificationToken, 
        isVerified: false, 
        verificationTokenExpiresAt: Date.now() + 60 * 60 * 1000 // expires in one hour
    });

    return user;
};

// static login method
userSchema.statics.login = async function (email: string, password: string): Promise<IUser> {
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    // check if email exists
    const user = await this.findOne({ email });
    
    if (!user) {
        throw Error('Incorrect email or password');
    }

    if (!user.password) {
        throw Error('Account requires password reset or was created with OAuth');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error('Incorrect email or password');
    }

    return user;
};

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;