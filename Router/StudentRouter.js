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
    else if(file.mimetype.startsWith('application/pdf')){
        cb(null,  true)
    }
    else {
  cb(new Error('Only image or PDF files are allowed'), false);
}

}

const upload = multer({
    storage: Storage,
    fileFilter: fileFilter,
    limits: {fileSize: 1024 * 1024 * 100}
})

//INSERT DATA API

router.post('/', upload.single('student_photo') , async(req, res) => {
    try {
 
        let data = await StudentModel(req.body);
 
        if(req.file){
            data.student_photo = req.file.filename
        }
 
        let newStudentData = await data.save();
        res.status(200).json(newStudentData);
 
    }
    catch (error) {
        res.status(500).json({ message: error.message });
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




//UPDATE DATA API
router.put("/update-student/:id", upload.single("student_photo"),  async (req, res) => {

 try {
        let existingStudent = await StudentModel.findById(req.params.id);

        //IMAGE UPDATE

        if(req.file) {
       if(existingStudent.student_photo) {
        const oldFilePath = path.join('./Uploads', existingStudent.student_photo);
        fs.unlink(oldFilePath,(err)=> {
            if(err) console.log('failed to image update....', err);
            })
        }
          req.body.student_photo = req.file.filename;
}
// duplicate image remove code
if (!existingStudent) {
    if (req.file.filename) {
        const filePath = path.join('./Uploads', req.file.filename)
        fs.unlink(filePath, (err)=> {
            if (err) console.log('failed to delete image: ', err);
               })
    }
      return res.status(404).json({ message: "student data not found" });
  }
 let data = await StudentModel.findByIdAndUpdate(req.params.id, req.body,
            { new: true }
        );
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message });

    }
});
//FINDONE AND UPDATE
router.put('/:id', async (req, res) => {
    try {
        const updatedStudent = await StudentModel.findOneAndUpdate(
            { _id: Number(req.params.id) }, // 👈 FIX IS HERE
            req.body,
            { new: true }
        );

        res.json(updatedStudent);
    } catch (error) {
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
router.get('/search/:key',async(req, res)=>{
    try{
        const key = req.params.key;
        const searchCon = [
            {student_name: {$regex: key,$options: 'i'}},
            {student_email: {$regex: key,$options: 'i'}},
            
        ]
        if(!isNaN(key) ){
            searchCon.push({ student_age: Number(key)});
        }

        let data = await StudentModel.find({
            $or: searchCon
        });

        if (data.length === 0){
         return res.status(404).json({message: "Student Not Found"});
        }
        res.json(data);

    }catch (error){
          res.status(500).json({message: error.message});
    }
});








export default router;
