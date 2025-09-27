import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

console.log("Cloudinary env check:", {
    cloud: process.env.CLOUDINARY_CLOUD_NAME,
    key: process.env.CLOUDINARY_API_KEY,
    secret: !!process.env.CLOUDINARY_API_SECRET
});



const uploadToCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;

    // Upload and wait for the promise to resolve
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "NoteHive",
    });

    // Remove the temp file after successful upload
    fs.unlinkSync(localFilePath);

    return response; // contains { public_id, secure_url, and other details ... }
  } catch (err) {
    console.error("Cloudinary upload error:", err);

    // Remove temp file on failure too
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export default uploadToCloudinary;
