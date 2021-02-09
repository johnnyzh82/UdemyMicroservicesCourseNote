import { Publisher, OrderCancelledEvent, Subjects } from "@jztickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
