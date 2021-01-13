import { Request, Response, NextFunction } from 'express';
// import { DatabaseConnectionError } from "../errors/database-connection-error";
// import { RequestValidationError } from "../errors/request-validation-error";
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    // if (err instanceof RequestValidationError) {
    //     console.log('handing this error as a request validation error');
    //     return res.status(err.statusCode).send(err.serializeErrors());
    // }

    // if (err instanceof DatabaseConnectionError) {
    //     console.log('handle this error as a database connection error');
    //     return res.status(err.statusCode).send(err.serializeErrors());
    // }

    // Improvement using abstract class
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send(err.serializeErrors());
    }

    console.log(err);
    
    res.status(400).send({
        errors: [{ message: "Something went wrong" }]
    });
}