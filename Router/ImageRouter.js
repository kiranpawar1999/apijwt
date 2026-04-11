import express from 'express';
import {upload} from '../middleware/uploadAuth.js';
import {deleteImage, getData, insertImage, updateData, updateImage} from '../Controller/imageController.js';

const router = express.Router();

router.get('/', getData);
router.post('/uploads', upload.single('image'), insertImage);
router.get("/update-page/:id", updateData);
router.post("/update/:id", upload.single("image"), updateImage);
router.get('/delete/:id', deleteImage);

export default router;