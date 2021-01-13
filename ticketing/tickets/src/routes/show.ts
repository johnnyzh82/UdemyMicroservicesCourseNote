import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotFoundError } from '@jztickets/common';
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id); // findById is helper built in model

    if (!ticket) {
        throw new NotFoundError();
    }
});

export { router as showTicketRouter };