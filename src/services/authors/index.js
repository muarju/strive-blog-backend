import express from "express"
import uniqid from "uniqid"
import createHttpError from 'http-errors'
import {getAuthors,writeAuthor,savePicture,authorJSONPath} from '../../lib/fs-tools.js'
import multer from 'multer'
import {extname} from 'path'
import {authorValidations} from './validation.js'
import { validationResult } from "express-validator";
import fs from "fs";

const authorsRouter = express.Router() //authors router


authorsRouter.post("/",authorValidations, async(request, response,next) => {
  try{
    const errorList=validationResult(request)
    console.log(errorList)
    if(!errorList.isEmpty()){
        next(createHttpError(400,{errorList}))
        
    }else{
        const authors= await getAuthors()
        const newAuthor = {... request.body, id:uniqid(), createdAt: new Date()}
        authors.push(newAuthor)
        await writeAuthor(authors)
        response.status(201).send({id:newAuthor.id})
    }

  }catch(error){
      next(error)
      console.log(error)
  }
})
//for avator upload
authorsRouter.put("/:id/uploadAvatar",multer().single("avatar"), async(request, response,next) => {
  try{
        const { originalname, buffer } = request.file;
        const extension = extname(originalname);
        const fileName = `${request.params.id}${extension}`;
        await savePicture(fileName,buffer)
        const link = `http://localhost:3001/img/${fileName}`;
        request.file = link;

        const fileAsBuffer = fs.readFileSync(authorJSONPath);
        const fileAsString = fileAsBuffer.toString();
        let fileAsJSONArray = JSON.parse(fileAsString);
        const authorIndex = fileAsJSONArray.findIndex(
          (author) => author.id === request.params.id
        );
        if (!authorIndex == -1) {
          response.status(404).send({ message: `Author with ${request.params.id} is not found!` });
        }
        const previousAuthorData = fileAsJSONArray[authorIndex];
        const changedAuthor = {... previousAuthorData,avatar: request.file,updatedAt: new Date(),id: request.params.id};
        fileAsJSONArray[authorIndex] = changedAuthor;
        fs.writeFileSync(authorJSONPath, JSON.stringify(fileAsJSONArray));
        response.send(changedAuthor);

  }catch(error){
      next(error)
  }
})


authorsRouter.get("/", async(request, response,next) => {
  try{
    const authors= await getAuthors()
    response.send(authors)
  }catch(error){
    next(error)
  }
})


authorsRouter.get("/:authorID", async(request, response,next) => {
  try{
    const authors=await getAuthors()
    const author=authors.find(a=>a.id===request.params.authorID)
    if(!author){
        next(createHttpError(404), { message: `Author requested with ${request.params.id} is not found` })
    }else{
        response.send(author)
    }
    
  }catch(error){
    next(error)
  }
})

authorsRouter.put("/:authorID",authorValidations, async(request, response,next) => {
  try{
    const errorList=validationResult(request)
        
    if(!errorList.isEmpty()){
        next(createHttpError(400,{errorList}))
        
    }else{
        const authors=await getAuthors()
        const remainingAuthors=authors.filter(a =>a.id !== request.params.authorID)
        const currentAuthor={... request.body, id:request.params.authorID}
        remainingAuthors.push(currentAuthor)
        await writeAuthor(remainingAuthors)
        response.send(currentAuthor)
    }
    
  }catch(error){
      next(error)
  }
})

authorsRouter.delete("/:authorID",async (request, response,next) => {
  try{
    const authors=await getAuthors()
    const remainingAuthors=authors.filter(a => a.id !== request.params.authorID)
    await writeAuthor(remainingAuthors)
    response.status(204).send("Deleted Successfully!")
  }catch(error){
      next(error)
  }
})

export default authorsRouter