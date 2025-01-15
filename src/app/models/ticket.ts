export class Ticket {
  ticketId: number = 0;
  userId?: number = 0;
  showtimeId: number = 0;
  seatId: number = 0;
  purchaseDate: Date = new Date();
  price: number = 0;
  quantity: number = 0;
}
