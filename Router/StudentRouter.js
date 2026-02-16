import StudentModel from '../models/StudentModel.js';
import express from 'express';
const router = express.Router();
import multer from 'multer';
import path from 'path';
import fs from 'fs';


const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Uploads');

    },
    filename: (req, file, cb) => {
        let newFile = Date.now() + path.extname(file.originalname);
        cb(null, newFile);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    }
    else if (file.mimetype.startsWith('application/pdf')) {
        cb(null, true)
    }
    else {
        cb(new Error('Only image or PDF files are allowed'), false);
    }

}

const upload = multer({
    storage: Storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 100 }
})

//INSERT DATA API

router.post('/', upload.single('student_photo'), async (req, res) => {
    try {

        console.log("BODY:", req.body);
        console.log("FILE:", req.file);


        if (req.file) {
            req.body.student_photo = req.file.filename;

        }
        const student = await StudentModel.create(req.body);

        res.status(201).json(student);

    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});


//READ DATA API
router.get('/read', async (req, res) => {
    try {
        let data = await StudentModel.find(req.body);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message });

    }
});
//READ ONE DATA API
router.get('/:_id', async (req, res) => {
    try {
        let data = await StudentModel.findById(req.params._id);
        if (!data) res.status(404).json({ message: "student data not fond" })
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message });

    }
});

//update data

router.put("/update-student/:_id", upload.single("student_photo"), async (req, res) => {
    try {

        let existingStudent = await StudentModel.findById(req.params._id);

        if (!existingStudent) {
            // remove uploaded file if student not found
            if (req.file.filename) {
                const filePath = path.join('./Uploads', req.file.filename);
                fs.unlink(filePath, (err) => {
                    if (err) console.log('failed to delete image: ', err);
                });
            }
            return res.status(404).json({ message: "student data not found" });
        }

        // IMAGE UPDATE
        if (req.file) {
            if (existingStudent.student_photo) {
                const oldFilePath = path.join('./Uploads', existingStudent.student_photo);
                fs.unlink(oldFilePath, (err) => {
                    if (err) console.log('failed to delete old image....', err);
                });
            }
            req.body.student_photo = req.file.filename;
        }

          // 🔥 THIS LINE ACTUALLY SAVES IN MONGODB
        const updatedStudent = await StudentModel.findByIdAndUpdate(
            existingStudent,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.json(updatedStudent);

        if (!updated) return res.status(404).json({ message: "Student Not Found" });
        res.json(updated);

    } catch (error) {
        console.log(error);   // 👈 important for debugging
        res.status(500).json({ message: error.message });
    }
});



//DELETE DATA API
router.delete('/:id', async (req, res) => {
    try {
        let data = await StudentModel.findByIdAndDelete(req.params.id);
        if (!data) res.status(404).json({ message: "student data delete" })
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message });

    }
});

// IMAGE UPLOAD
router.post('/upload', async (req, res) => {
    try {
        let data = await StudentModel.upload(req.body);
        res.status(200).json(data)
    }
    catch (error) {
        res.json({ message: error.message });

    }
});

//SEARCH DATA API
router.get('/search/:key', async (req, res) => {
    try {
        const key = req.params.key;
        const searchCon = [
            { student_name: { $regex: key, $options: 'i' } },
            { student_email: { $regex: key, $options: 'i' } },

        ]
        if (!isNaN(key)) {
            searchCon.push({ student_age: Number(key) });
        }

        let data = await StudentModel.find({
            $or: searchCon
        });

        if (data.length === 0) {
            return res.status(404).json({ message: "Student Not Found" });
        }
        res.json(data);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export default router;
