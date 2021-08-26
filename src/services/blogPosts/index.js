import express, { response } from 'express'
import uniqid from 'uniqid'
import {blogPostValidations} from './validations.js'
import createHttpError from 'http-errors'
import { validationResult } from "express-validator";
import {getPost,writePost,savePicture,blogPostJSONPath} from '../../lib/fs-tools.js'
import multer from 'multer'
import fs from "fs";
import {extname} from 'path'


const blogPostRouter=express.Router();


blogPostRouter.get("/", async(request,response,next)=>{
    try{
        const posts= await getPost()
        response.send(posts)

    }catch(error){
        next(error)
    }
})
blogPostRouter.get("/:id",async(request,response,next)=>{
    try{
        const posts=await getPost()
        const post=posts.find(p=>p.id===request.params.id)
        if(!post){
            next(createHttpError(404), { message: `Blog Post requested with ${request.params.id} is not found` })
        }else{
            response.send(post)
        }
        
    }catch(error){
        next(error)
    }
})
blogPostRouter.post("/",blogPostValidations, async(request,response,next)=>{
    try{
        const errorList=validationResult(request)
        console.log(errorList)
        if(!errorList.isEmpty()){
            next(createHttpError(400,{errorList}))
            
        }else{
            const posts= await getPost()
            const newPost = {... request.body, id:uniqid(), createdAt: new Date()}
            posts.push(newPost)
            await writePost(posts)
            
            response.status(201).send({id:newPost.id})
        }

    }catch(error){
        next(error)
        console.log(error)
    }
})

//for Cover upload
blogPostRouter.put("/:id/cover",multer().single("cover"), async(request, response,next) => {
  try{
        
    const { originalname, buffer } = request.file
    const extension = extname(originalname)
    const fileName = `${request.params.id}${extension}`
    await savePicture(fileName,buffer)
    const link = `http://localhost:3001/img/${fileName}`
    request.file = link

    const fileAsBuffer = fs.readFileSync(blogPostJSONPath)
    const fileAsString = fileAsBuffer.toString()
    let fileAsJSONArray = JSON.parse(fileAsString)
   
    const PostIndex = fileAsJSONArray.findIndex((post) => post.id === request.params.id)
    if (!postIndex == -1) {
      response.status(404).send({ message: `Post with ${request.params.id} is not found!` })
    }
    const previousPostData = fileAsJSONArray[PostIndex]
    console.log(previousPostData)
    const changedPost = {...previousPostData,cover: request.file,updatedAt: new Date(),id: request.params.id}
   
    fileAsJSONArray[postIndex] = changedPost;
    fs.writeFileSync(blogPostJSONPath, JSON.stringify(fileAsJSONArray));
    response.send(changedPost);

  }catch(error){
      next(error)
  }
})

blogPostRouter.put("/:id",blogPostValidations, async(request,response,next)=>{
    try{
        const errorList=validationResult(request)
        
        if(!errorList.isEmpty()){
            next(createHttpError(400,{errorList}))
            
        }else{  
            const posts=await getPost()
            const remainingPosts=posts.filter(post =>post.id !== request.params.id)
            const currentPost={... request.body, id:request.params.id}
            remainingPosts.push(currentPost)
            await writePost(remainingPosts)
            response.send(currentPost)
        }
    }catch(error){
        next(error)
    }
})
blogPostRouter.delete("/:id",async(request,response,next)=>{
    try{
        const posts=await getPost()
        const post=posts.find(p=>p.id===request.params.id)
        if(!post){
            next(createHttpError(404), { message: `Blog Post requested with ${request.params.id} is not found` })
        }else{
            const remainingPosts=posts.filter(post => post.id !== request.params.id)
            await writePost(remainingPosts)
            response.status(204).send()
        }
        
    }catch(error){
        next(error)
    }
})

export default blogPostRouter