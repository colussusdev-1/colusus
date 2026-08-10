import cloudinary from "../config/cloudinary.js";

const testCloudinary = async () => {
  try {
    const result = await cloudinary.api.ping();

    console.log("=================================");

    console.log("CLOUDINARY CONNECTION");

    console.log("=================================");

    console.log(result);
  } catch (error) {
    console.error("=================================");

    console.error("CLOUDINARY CONNECTION FAILED");

    console.error("=================================");

    console.error("Message:", error?.message);

    console.error("HTTP Code:", error?.http_code);

    console.error("Name:", error?.name);

    console.error("Full Error:", error);
  }
};

export default testCloudinary;
