import express from 'express';
import "express-async-errors";
import { json } from 'body-parser';
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@jztickets/common";
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false, // encrypted
        secure: process.env.NODE_ENV !== 'test',  // https
    })
);

app.use(currentUser);

app.get("*", async (req, res, next) => {
    // next(new NotFoundError());
    throw new NotFoundError();
});

app.use(createChargeRouter);
app.use(errorHandler);

export { app };