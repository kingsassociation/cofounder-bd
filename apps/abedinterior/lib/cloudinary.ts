import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const getPublicIdFromUrl = (fileUrl: string | undefined | null) => {
  if (!fileUrl) return null;
  try {
    const match = fileUrl.match(
      /\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/,
    );
    if (!match || !match[1]) {
      console.error("Could not extract public ID from URL:", fileUrl);
      return null;
    }
    const publicId = match[1].replace(/\.[a-zA-Z0-9]+$/, "");
    return publicId;
  } catch (err) {
    console.error("Error extracting public ID:", err);
    return null;
  }
};
export const uploadImage = async (
  localFilePath: string,
  folder = "ZestWear",
) => {
  if (!localFilePath) return null;
  try {
    const res = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: "image",
    });
    return res;
  } catch (err: any) {
    throw new Error(err?.message || "Cloudinary upload error");
  } finally {
    try {
      if (localFilePath && fs.existsSync(localFilePath))
        fs.unlinkSync(localFilePath);
    } catch (e) {}
  }
};
export const deleteImageByUrl = async (fileUrl: string | undefined | null) => {
  if (!fileUrl) return { success: true, message: "No file" };
  const publicId = getPublicIdFromUrl(fileUrl);
  if (!publicId) {
    console.warn(
      "Could not extract public ID from URL, skipping deletion:",
      fileUrl,
    );
    return { success: true, message: "No valid public id" };
  }
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    if (result.result === "ok" || result.result === "not found")
      return { success: true };
    return { success: false, message: result.result };
  } catch (err: any) {
    console.error("Error deleting from Cloudinary:", err);
    return {
      success: false,
      message: err?.message || "Cloudinary delete error",
    };
  }
};
export default cloudinary;
