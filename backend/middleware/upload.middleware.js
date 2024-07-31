import { randomUUID } from "crypto";
import multer, { diskStorage } from "multer";
import { extname } from "path";

function upload(destination) {
  const storage = diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination);
    },
    filename: function (req, file, cb) {
      cb(null, randomUUID() + extname(file.originalname));
    },
  });

  return multer({ storage: storage });
}

export default upload;
