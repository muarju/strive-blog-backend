import express from "express"
import { fileURLToPath } from "url" 
import { dirname, join } from "path" 
import fs from "fs"
import uniqid from "uniqid"

const authorsRouter = express.Router() //authors router

const currentFilePath = fileURLToPath(import.meta.url) //current file path
const currentDirPath = dirname(currentFilePath) //current folder
const authorsJSONPath = join(currentDirPath, "authors.json") //our json file

authorsRouter.post("/", (request, response) => {

  const newAuthor = { ...request.body, id: uniqid(), createdAt: new Date() } //get requestbody and add uniqe id
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  authors.push(newAuthor)
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authors)) //write json file with new data
  response.status(201).send({ id: newAuthor.id })
})


authorsRouter.get("/", (request, response) => {

  const fileContent = fs.readFileSync(authorsJSONPath) // we get back a BUFFER which is the content of the file (MACHINE READABLE)
  response.send(JSON.parse(fileContent)) // JSON parse converts BUFFER into JSON
})


authorsRouter.get("/:authorID", (request, response) => {
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  const author = authors.find(s => s.id === request.params.authorID) // = = = ===
  response.send(author)
})

authorsRouter.put("/:authorID", (request, response) => {
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  const remainingAuthors = authors.filter(author => author.id !== request.params.authorID)
  const updatedAuthor = { ...request.body, id: request.params.authorID }
  remainingAuthors.push(updatedAuthor)
  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))
  response.send(updatedAuthor)
})

authorsRouter.delete("/:authorID", (request, response) => {
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  const remainingAuthors = authors.filter(author => author.id !== request.params.authorID)
  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))
  response.status(204).send()
})

export default authorsRouter