import { Publisher, OrderCreatedEvent, Subjects } from "@jztickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
