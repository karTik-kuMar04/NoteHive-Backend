import mongoose from "mongoose";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";


export interface IUser extends mongoose.Document {
    name: string;
    username: string;
    email: string;
    password: string;
    avatar: string;
    refreshToken?: string;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        username: { type: String, required: true, unique: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        avatar: {
          public_id: { type: String, required: true },
          url: { type: String, required: true }
        },
        refreshToken: { type: String }
    },{ 
        timestamps: true 
    }
);

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
});

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
} 

userSchema.methods.generateAccessToken = function (
  this: IUser & mongoose.Document
): string {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET as Secret,
    {
      expiresIn: (process.env.ACCESS_TOKEN_SECRET_EXPIRES_IN ||
        "1h") as SignOptions["expiresIn"],
    }
  );
};


userSchema.methods.generateRefreshToken = function (
  this: IUser & mongoose.Document
): string {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET as Secret,
    {
      expiresIn: (process.env.REFRESH_TOKEN_SECRET_EXPIRES_IN ||
        "7d") as SignOptions["expiresIn"],
    }
  );
};


export const User = mongoose.model<IUser>('User', userSchema);