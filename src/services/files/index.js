/*
1. POST /files/upload
2. POST /files/uploadMultiple
*/
import express from 'express'
import multer from 'multer'
import {saveBlogPicture} from '../../lib/fs-tools.js'



const fileRouter=express.Router()

//avatar is a field name of image
fileRouter.post("/upload", multer().single("avatar"), async(req,res,next)=>{
    try{
        console.log(req.file)
        await saveBlogPicture(req.file.originalname,req.file.buffer)
        res.send("Uploaded!")
    }catch(error){
        next(error)
    }

})

fileRouter.post("/uploadMultiple",multer().array("avatar"), async(req,res,next)=>{
    try{
        const arrayOfPromises=req.files.map(file=>saveBlogPicture(file.originalname, file.buffer))
        await Promise.all(arrayOfPromises)
        res.send("Uploaded!")
    }catch(error){
        next(error)
    }
})
export default fileRouter