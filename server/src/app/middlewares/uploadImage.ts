/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from "multer";
import path from "path";
import * as dotenv from "dotenv";

const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, String(process.env.UPLOADS_DIR) || "uploads/"); // Uploads will be stored in 'uploads/' directory
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname.trim()); // Rename file with timestamp
//   },
// });

// const fileFilterConfig = function (req: any, file: any, cb: any) {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     // calling callback with true
//     // as mimetype of file is image
//     cb(null, true);
//   } else {
//     // false to indicate not to store the file
//     cb(null, false);
//   }
// };
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const fileRegex = new RegExp(".(jpg|jpeg|png)$");
    const fileName = file.originalname;

    if (!fileName.match(fileRegex)) {
      //throw exception
      return cb(new Error("Invalid file type"));
    }
    //pass the file
    cb(null, true);
  },
}).single("file");

export default upload;
