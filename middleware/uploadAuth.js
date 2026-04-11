import multer from "multer";
import path from "path";

const storage = multer.diskStorage({   // 👈 small s kar diya
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const newImage = Date.now() + path.extname(file.originalname);
        cb(null, newImage);
    }
});

export const upload = multer({
    storage: storage,
    limits: { fieldSize: 1024 * 1024 * 50 }  // 👈 fieldSize bhi correct kiya
});