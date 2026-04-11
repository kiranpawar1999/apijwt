import cloudinary from "../Config/Cloudinary.js";
import imageUploadModel from "../models/imageModel.js";
import fs from "fs";

// ✅ Get All Data (Home Page)
export const getData = async (req, res) => {
    try {
        const data = await imageUploadModel.find();
        const message = req.query.msg || "";

        // ✅ ONLY ONE RESPONSE
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

        const uploadResult = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: "StudentsPhoto"
            }
        );

        // ✅ delete local file
        fs.unlinkSync(req.file.path);

        await imageUploadModel.create({
            student_image: uploadResult.secure_url,
            public_id: uploadResult.public_id
        });

        const allData = await imageUploadModel.find();

        res.status(201).render("Home", {
            message: "Student Image Uploaded Successfully",
            data: allData
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

        // ✅ delete from cloudinary
        await cloudinary.uploader.destroy(data.public_id);

        // ✅ delete from DB
        await imageUploadModel.findByIdAndDelete(req.params.id);

        res.redirect("/?msg=Image Deleted Successfully");  // ✅ FIXED

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

        // ✅ delete old image
        await cloudinary.uploader.destroy(data.public_id);

        const uploadResult = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: "StudentsPhoto"  // ✅ same folder
            }
        );

        fs.unlinkSync(req.file.path);

        await imageUploadModel.findByIdAndUpdate(req.params.id, {
            student_image: uploadResult.secure_url,
            public_id: uploadResult.public_id
        });

        res.redirect("/?msg=Image Updated Successfully");

    } catch (error) {
        res.redirect("/?msg=Error Updating Image");
    }
};