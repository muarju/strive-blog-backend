import {body} from 'express-validator'

export const authorValidations=[
    body("name").exists().withMessage("Name is mandatory"),
    body("avatar").exists().withMessage("Avatar is mandatory"),
    body("surname").exists().withMessage("Surname is mandatory"),
    body("email").exists().withMessage("Email value is mandatory"),
    body("dob").exists().withMessage("Date of Birth is mandatory")
]