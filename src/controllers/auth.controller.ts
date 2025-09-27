import { Request, Response } from "express";

import { User } from "../models/user.model";
import API_ERROR from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import uploadToCloudinary from "../utils/cloudinary";
import API_RES from "../utils/ApiResponce";

const CreateUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        throw new API_ERROR(4030, "Bad Request");
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

export { 
    CreateUser
};