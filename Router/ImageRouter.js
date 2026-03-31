import express from "express";
import upload from "../middleware/upload.js";
import {
  getData,
  insertImage,
  deleteImage,
  updateData,
  updateImage,
} from "../controllers/imageController.js";

const router = express.Router();

router.get("/", getData);

router.post("/insert", upload.single("image"), insertImage);

router.get("/delete/:id", deleteImage);

router.get("/update/:id", updateData);

router.post("/update/:id", upload.single("image"), updateImage);

export default router;