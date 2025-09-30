import { Request, Response } from "express";

import { User } from "../models/user.model";
import API_ERROR from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import uploadToCloudinary from "../utils/cloudinary";
import API_RES from "../utils/ApiResponce";


const CreateUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        throw new API_ERROR(403, "Bad Request");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    // checking if user already exists
    if (existedUser) {
        throw new API_ERROR(409, "User with email or username already exists");
    }

    const avatarPath = req.file ? req.file.path : null;

    if (!avatarPath) {
        throw new API_ERROR(400, "Avatar file is required");
    }

    const avatar = await uploadToCloudinary(avatarPath);

    if (!avatar) {
        throw new API_ERROR(500, "Failed to upload avatar");
    }

    const user = await User.create({
        name,
        username,
        email,
        password,
        avatar: {
            public_id: avatar.public_id,
            url: avatar.secure_url
        }
    })

    const isUserCreated = await User.findById(user._id).select("-password -refreshToken");

    if (!isUserCreated) {
        throw new API_ERROR(500, "Failed to Register user");
    }

    return res.status(201).json(
        new API_RES(200, isUserCreated, "User registered successfully" )
    )
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new API_ERROR(4030, "Bad Request");
    }

    const user = await User.findOne({ email });
    console.log(user)

    if (!user) {
        throw new API_ERROR(404, "User not found");
    }

    const isPasswordMatched = await user.isPasswordCorrect(password);

    if (!isPasswordMatched) {
        throw new API_ERROR(401, "Invalid credentials");
    }


    const accessToken: string = user.generateAccessToken()
    const refreshToken: string = user.generateRefreshToken() as string

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json(
        new API_RES(
            201,
            {
                accessToken,
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar
                }
            },
            "login successful"
        )
    )
});


export { 
    CreateUser,
    loginUser
};


