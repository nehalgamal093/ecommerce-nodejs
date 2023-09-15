import multer from "multer";
import { accountStorage } from "../../../config/cloudinaryAccountStorage.js";

export const imageUploader = (
    allowed_file_types,
    max_file_size,
    max_number_of_upload_file,
    error_msg
  ) => {
    const upload = multer({
      storage: accountStorage,
      limits: {
        fileSize: max_file_size,
      },
      fileFilter: (req, file, cb) => {
        if (req.files.length > max_number_of_upload_file) {
          cb(
            new Error(
              `Maximum ${max_number_of_upload_file} files are allowed to upload`
            )
          );
        } else {
          if (allowed_file_types.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(new Error(error_msg));
          }
        }
      },
    });
    return upload;
  };