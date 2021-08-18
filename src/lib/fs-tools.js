import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname,join } from 'path'
import { cwd } from "process";

export const authorsImgFdrPath = join(cwd(), "public/img/authors")
export const blogPostsImgFdrPath = join(cwd(), "public/img/blogPosts")

const {readJSON, writeJSON, writeFile}=fs
const authorJSONPath=join(dirname(fileURLToPath(import.meta.url)),"../data/authors.json")
const blogPostJSONPath=join(dirname(fileURLToPath(import.meta.url)),"../data/posts.json")
export const publicBlogFolderPath=join(dirname(fileURLToPath(import.meta.url)),"../../public/img/blog/")
export const publicAuthorsFolderPath=join(dirname(fileURLToPath(import.meta.url)),"../../public/img/authors/")

export const getAuthors=()=>readJSON(authorJSONPath)
export const writeAuthor=(content)=>writeJSON(authorJSONPath,content)
export const getPost=()=>readJSON(blogPostJSONPath)
export const writePost=(content)=>writeJSON(blogPostJSONPath,content)
export const saveBlogPicture=(filename, content)=>writeFile(join(publicBlogFolderPath, filename), content)
export const saveAuthorPicture=(filename, content)=>writeFile(join(publicAuthorsFolderPath, filename), content)