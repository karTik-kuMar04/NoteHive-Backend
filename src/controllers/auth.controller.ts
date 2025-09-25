import { User } from "../models/user.model";
import API_ERROR from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

const CreateUser = asyncHandler(async (req: any, res: any) => {
    const { name, username, email, password, avatar } = req.body;

    if (!name || !username || !email || !password || !avatar) {
        throw new API_ERROR(500, "Something went wrong")
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    // checking if user already exists
    if (existedUser) {
        throw new API_ERROR(400, "User already exists");
    }

    
});