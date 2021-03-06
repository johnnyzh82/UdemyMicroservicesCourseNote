import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from "jsonwebtoken";

import { User} from "../models/user";
import { validateRequest, BadRequestError } from '@jztickets/common';
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin', 
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        // Abstracted to middleware validate-request at line 19
        // const errors = validationResult(req);
        // // If validator contains some errors
        // if (!errors.isEmpty()) {
        //     throw new RequestValidationError(errors.array());
        // }

        const { email, password } = req.body;

        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            throw new BadRequestError("Invalid credentials");
        }

        const passwordsMatch = await Password.compare(existingUser.password, password);
        if (!passwordsMatch) {            
            throw new BadRequestError("Invalid credentials");
        }

        // Generate JWT
        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email,
        }, process.env.JWT_KEY!);

        // Store it on session object
        req.session = {
            jwt: userJwt
        };
        
        res.status(200).send(existingUser);
    });

export { router as signinRouter };