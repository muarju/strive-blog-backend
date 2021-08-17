import express from "express"
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./services/authors/index.js"
import blogPostRouter from './services/blogPosts/index.js'
import fileRouter from './services/files/index.js'
import {notFoundErrorHandler,forbiddenErrorHandler, badRequestErrorHandler,serverErrorHandler} from './errorHandler.js'
import cors from 'cors'
import {join} from 'path'

const server = express()

const port = process.env.PORT

//Middleware
const loggerMiddleware=(req,res,next)=>{
  req.user={name: "Arju"}
  console.log(`Red method ${req.method} -- Req URL ${req.url} -- ${new Date()}`)
  next() //I need to execute this functions in give the control to what is coming next
}

const authenticationMiddleware=(req,res,next)=>{
  if(req.user.name==="Arju"){
    next()
  }else{
    req.status(401).send()
  }
}

const publicFolderPath=join(process.cwd(), "public")


//Global Middleware
server.use(express.static(publicFolderPath))
server.use(loggerMiddleware)
server.use(authenticationMiddleware)
server.use(cors())
server.use(express.json())

// *************** ROUTES *****************
server.use("/authors", authorsRouter)
server.use("/blogPost", blogPostRouter)
server.use("/files", fileRouter)

//error Middleware
server.use(notFoundErrorHandler)
server.use(badRequestErrorHandler)
server.use(forbiddenErrorHandler)
server.use(serverErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
  console.log("Server listening on port " + port)
})
