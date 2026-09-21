import uploadService from "./upload.service.js";

const uploadFile = async (req, res, next) => {
  try {
    const result = await uploadService.uploadFile({
      file: req.file,
      type: req.body?.type || "DOCUMENT",
    });

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  uploadFile,
};
