import express from "express"
import uniqid from "uniqid"
import createHttpError from 'http-errors'
import {getAuthors,writeAuthor,saveAuthorPicture,publicAuthorsFolderPath} from '../../lib/fs-tools.js'
import multer from 'multer'
import {join} from 'path'

const authorsRouter = express.Router() //authors router


authorsRouter.post("/", async(request, response,next) => {
  try{
    const errorList=validationResult(request)
    
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
  }
})
//for avator upload
authorsRouter.post("/:id/uploadAvatar",multer().single("avatar"), async(request, response,next) => {
  try{
        await saveAuthorPicture(request.file.originalname,request.file.buffer)
        
        const authors=await getAuthors()
        const author=authors.find(a=>a.id===request.params.id)
        const remainingAuthors=authors.filter(a =>a.id !== request.params.id)
        const currentAuthor={... request.body, id:request.params.id,avatar:join(publicAuthorsFolderPath,request.file.originalname),name:author.name,surname:author.surname,email:author.email,dob:author.dob,createdAt:author.createdAt }
        remainingAuthors.push(currentAuthor)
        await writeAuthor(remainingAuthors)
        response.send(currentAuthor)
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

authorsRouter.put("/:authorID", async(request, response,next) => {
  try{
        const authors=await getAuthors()
        const remainingAuthors=authors.filter(a =>a.id !== request.params.authorID)
        const currentAuthor={... request.body, id:request.params.authorID}
        remainingAuthors.push(currentAuthor)
        await writeAuthor(remainingAuthors)
        response.send(currentAuthor)
    
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