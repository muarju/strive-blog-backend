import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname,join } from 'path'
import { cwd } from "process";

export const publicImgFolderPath = join(cwd(), "public/img/")
const {readJSON, writeJSON, writeFile}=fs
export const authorJSONPath=join(dirname(fileURLToPath(import.meta.url)),"../data/authors.json")
export const blogPostJSONPath=join(dirname(fileURLToPath(import.meta.url)),"../data/posts.json")

export const getAuthors=()=>readJSON(authorJSONPath)
export const writeAuthor=(content)=>writeJSON(authorJSONPath,content)
export const getPost=()=>readJSON(blogPostJSONPath)
export const writePost=(content)=>writeJSON(blogPostJSONPath,content)
export const savePicture=(filename, content)=>writeFile(join(publicImgFolderPath, filename), content)