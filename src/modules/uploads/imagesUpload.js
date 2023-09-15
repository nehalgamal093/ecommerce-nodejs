import { imageUploader } from "./imageUploader.js";

export function imagesUpload(req, res, next) {
  const upload = imageUploader(
    ["image/jpeg", "image/jpg", "image/png"],
    25000000,
    10,
    "ONLY .jpeg .jpg or .png format allowed"
  );

  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          images: {
            msg: err,
          },
        },
      });
    } else {
      next();
    }
  });
}
