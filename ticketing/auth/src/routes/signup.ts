import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from "jsonwebtoken";

import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
// import { DatabaseConnectionError } from "../errors/database-connection-error";
// import { RequestValidationError } from "../errors/request-validation-error";
import { BadRequestError } from "../errors/bad-request-error";
const router = express.Router();

router.post('/api/users/signup', 
    [
        body('email')
            .isEmail()
            .withMessage("Email must be valid"),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20 characters')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        // Abstracted to middleware validate-request at line 22
        // const errors = validationResult(req);
        // // If validator contains some errors
        // if (!errors.isEmpty()) {
        //     throw new RequestValidationError(errors.array());
        // }

        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // console.log('Email in use');
            // return res.send({});
            throw new BadRequestError('Email in use');
        }

        const user = User.build({ email, password });
        await user.save();

        // Generate JWT
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email,
        }, process.env.JWT_KEY!);

        // Store it on session object
        req.session = {
            jwt: userJwt
        };
        
        res.status(201).send(user);
    }
);

export { router as signupRouter };