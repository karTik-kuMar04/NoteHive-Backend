import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadToCloudinary = async (localFilePath: any) => {
    try {
        if (!localFilePath) {
            return null
        }
        const responce = await cloudinary.uploader.upload(localFilePath, { folder: "NoteHive" }, (err) => {
            if (err) {
                console.log(err);
                return null;
            }
        })
        return responce;
    } catch (err) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export default uploadToCloudinary;