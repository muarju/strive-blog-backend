import {body} from 'express-validator'

export const blogPostValidations=[
    body("title").exists().withMessage("Titile is mandatory"),
    body("category").exists().withMessage("category is mandatory"),
    body("cover").exists().withMessage("cover is mandatory"),
    body("readTime.value").exists().isNumeric().withMessage("readTime value is mandatory"),
    body("readTime.unit").exists().withMessage("readTime unit is mandatory"),
    body("author.name").exists().withMessage("author name is mandatory"),
    body("author.avatar").exists().withMessage("author avatar is mandatory"),
    body("content").exists().withMessage("content is mandatory")
]