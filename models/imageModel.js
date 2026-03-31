import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  student_name: {
    type: String,
    required: true,
  },
  student_image: {
    type: String,
  },
  public_id: {
    type: String,
  },
});

export default mongoose.model("Image", imageSchema);