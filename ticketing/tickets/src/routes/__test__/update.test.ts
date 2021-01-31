import request from 'supertest';
import { app } from '../../app';
import mongoose from "mongoose";
import { natsWrapper } from '../../nats-wrapper';

// 404: invalid path

// 401: forbiddin, not their ticket

// 400: invalid body

it('returns a 404 if the provided id does not exist', async () => {
    const id = mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", global.signin())
        .send({
            title: "testtitle",
            price: 20
        })
        .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
    const id = mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "testtitle",
            price: 20
        })
        .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "asdfasf",
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)            
        .set("Cookie", global.signin())
        .send({
            title: "asdfasf",
            price: 1000
        })            
        .expect(401);
});

it('returns a 400 if the user provide invalid title or price', async () => {
    const cookie = global.signin();

    // create a ticket
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "asdfasf",
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)            
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 1000
        })            
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)            
        .set("Cookie", cookie)
        .send({
            title: "asdfa",
            price: -10
        })            
        .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signin();

    // create a ticket
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "asdfasf",
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)            
        .set("Cookie", cookie)
        .send({
            title: "test",
            price: 30
        })            
        .expect(200);
    
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

    expect(ticketResponse.body.title).toEqual('test');
    expect(ticketResponse.body.price).toEqual(30);
});

it ('publishes an event', async () => {
    const cookie = global.signin();

    // create a ticket
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "asdfasf",
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)            
        .set("Cookie", cookie)
        .send({
            title: "test",
            price: 30
        })            
        .expect(200);
        
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});