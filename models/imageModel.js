import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const ImageSchema = new mongoose.Schema({   // 👈 spelling fix
     student_image: {
        type: String,
        required: true
    },
    public_id: {
        type: String
    }
}, { timestamps: true });

const imageUploadModel = mongoose.model(
    process.env.STUDENT_IMAGE || "studentImage",
    ImageSchema   // 👈 same name use karo
);

export default imageUploadModel;