import { Request, Response } from "express";

import { User } from "../models/user.model";
import asyncHandler from "../utils/asyncHandler";
import uploadToCloudinary from "../utils/cloudinary";
import API_RES from "../utils/ApiResponce";


const CreateUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    // checking if user already exists
    if (existedUser) {
        return res.status(409).json({ message: "User already exists with this email or username" });
    }

    const avatarPath = req.file ? req.file.path : null;

    if (!avatarPath) {
        return res.status(400).json({ message: "Please upload an avatar" });
    }

    const avatar = await uploadToCloudinary(avatarPath);

    if (!avatar) {
        return res.status(500).json({ message: "Failed to upload avatar" });
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
        return res.status(500).json({ message: "Failed to create user" });
    }

    return res.status(201).json(
        new API_RES(200, isUserCreated, "User registered successfully" )
    )
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    console.log(user)

    if (!user) {
        return res.status(404).json({ message: "User not found with this email" });
    }

    const isPasswordMatched = await user.isPasswordCorrect(password);

    if (!isPasswordMatched) {
        return res.status(401).json({ message: "Entered password is Incorrect" });
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


