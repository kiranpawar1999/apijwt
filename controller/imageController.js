import cloudinary from "../config/Cloudinary.js";
import imageUploadModel from "../models/imageModel.js";

// ✅ Get All Data
export const getData = async (req, res) => {
  try {
    const data = await imageUploadModel.find();
    const message = req.query.msg || "";

    res.render("Home", { data, message });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// ✅ Insert Image
export const insertImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No Image Uploaded");
    }

    await imageUploadModel.create({
      student_name: req.body.name,
      student_image: req.file.path,   // ✅ Cloudinary URL
      public_id: req.file.filename,   // ✅ public_id
    });

    const allData = await imageUploadModel.find();

    res.status(201).render("Home", {
      message: "Image Uploaded Successfully",
      data: allData,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// ✅ Delete Image
export const deleteImage = async (req, res) => {
  try {
    const data = await imageUploadModel.findById(req.params.id);

    if (!data) {
      return res.redirect("/?msg=Image Not Found");
    }

    await cloudinary.uploader.destroy(data.public_id);

    await imageUploadModel.findByIdAndDelete(req.params.id);

    res.redirect("/?msg=Image Deleted Successfully");
  } catch (error) {
    res.redirect("/?msg=Error Deleting Image");
  }
};

// ✅ Load Update Page
export const updateData = async (req, res) => {
  try {
    const updateData = await imageUploadModel.findById(req.params.id);

    if (!updateData) {
      return res.render("Update", { message: "User Not Found" });
    }

    res.render("Update", { updateData });
  } catch (error) {
    res.render("Update", { message: error.message });
  }
};

// ✅ Update Image
export const updateImage = async (req, res) => {
  try {
    const data = await imageUploadModel.findById(req.params.id);

    if (!data) {
      return res.redirect("/?msg=Image Not Found");
    }

    // delete old image
    await cloudinary.uploader.destroy(data.public_id);

    await imageUploadModel.findByIdAndUpdate(req.params.id, {
      student_name: req.body.name,
      student_image: req.file.path,
      public_id: req.file.filename,
    });

    res.redirect("/?msg=Image Updated Successfully");
  } catch (error) {
    res.redirect("/?msg=Error Updating Image");
  }
};