import { Component } from '@angular/core';
import { Seat } from '../../models/seat';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from '../../models/ticket';
import { Showtime } from '../../models/showtime';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GenericService } from '../../service/generic.service';

@Component({
  selector: 'app-order',
  imports: [FormsModule, CommonModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent {
  showtimeId: number = 0;
  theaterId: number = 0;
  ticketTypes: { name: string; price: number }[] = [
    { name: 'Adult', price: 135 },
    { name: 'Student', price: 125 },
    { name: 'Child', price: 100 },
    { name: 'Senior', price: 115 },
  ];
  selectedTicketType: string = 'Adult'; // Default ticket type
  ticketQuantities: { [key: string]: number } = {
    Adult: 0,
    Student: 0,
    Child: 0,
    Senior: 0,
  };
  seats: Seat[][] = [];
  selectedSeats: Seat[] = [];
  userId = this.showtimeId || 0;
  totalPrice: number = 0;
  constructor(
    private route: ActivatedRoute,
    private seatService: GenericService<Seat>,
    private showtimeService: GenericService<Showtime>
  ) {}

  ngOnInit(): void {
    this.showtimeId = Number(this.route.snapshot.paramMap.get('showtimeId'));
    this.loadShowtimeDetails(this.showtimeId);
  }

  loadShowtimeDetails(showtimeId: number): void {
    this.showtimeService
      .getbyid('Showtimes', showtimeId)
      .subscribe((showtime: Showtime) => {
        this.theaterId = showtime.theaterId;
        this.loadSeats();
      });
  }

  loadSeats(): void {
    this.seatService.getAll('Seats').subscribe((data) => {
      this.groupSeatsByColumnRow(data);
    });
  }

  get formattedSelectedSeats(): string {
    return this.selectedSeats
      .map((s) => `R${s.seatNumber}, Seat ${s.rowNumber}`)
      .join(' - ');
  }

  groupSeatsByColumnRow(seats: Seat[]): void {
    const filteredSeats = seats.filter(
      (seat) => seat.theaterId === this.theaterId
    );

    const groupedSeats: { [key: number]: Seat[] } = {};

    filteredSeats.forEach((seat) => {
      if (!groupedSeats[seat.rowNumber]) {
        groupedSeats[seat.rowNumber] = [];
      }
      groupedSeats[seat.rowNumber].push(seat);
    });

    const maxRow = Math.max(...filteredSeats.map((seat) => seat.rowNumber));
    const maxColumn = Math.max(...filteredSeats.map((seat) => seat.seatNumber));

    const seatingGrid: Seat[][] = [];

    for (let row = 1; row <= maxRow; row++) {
      const rowSeats = [];
      for (let seat = 1; seat <= maxColumn; seat++) {
        const seatObj = filteredSeats.find(
          (s) => s.rowNumber === row && s.seatNumber === seat
        );

        const seatAvailability = seatObj ? seatObj.isAvailable : true;

        rowSeats.push(
          seatObj || {
            seatId: 0,
            rowNumber: row,
            seatNumber: seat,
            isAvailable: seatAvailability,
            theaterId: this.theaterId,
          }
        );
      }
      seatingGrid.push(rowSeats);
    }

    this.seats = seatingGrid;
  }

  toggleSeatSelection(seat: Seat): void {
    const totalQuantity = Object.values(this.ticketQuantities).reduce(
      (total, quantity) => total + quantity,
      0
    );

    if (!seat.isAvailable || this.selectedSeats.length >= totalQuantity) return;

    if (this.selectedSeats.includes(seat)) {
      this.selectedSeats = this.selectedSeats.filter((s) => s !== seat);
    } else {
      this.selectedSeats.push(seat);
    }
  }

  updateTicketQuantity(ticketType: string, change: number): void {
    const newQuantity = Math.max(0, this.ticketQuantities[ticketType] + change);
    this.ticketQuantities[ticketType] = newQuantity;
  }

  completeOrder(): void {
    const totalQuantity = Object.values(this.ticketQuantities).reduce(
      (total, quantity) => total + quantity,
      0
    );

    if (this.selectedSeats.length !== totalQuantity) {
      alert(`Please select ${totalQuantity} seat(s).`);
      return;
    }

    let totalPrice = 0;
    this.ticketTypes.forEach((ticketType) => {
      totalPrice += this.ticketQuantities[ticketType.name] * ticketType.price;
    });

    const ticket: Ticket = {
      ticketId: 0,
      userId: this.userId,
      showtimeId: this.showtimeId,
      seatId: this.selectedSeats[0].seatId, // Simplified for single ticket
      purchaseDate: new Date(),
      price: totalPrice,
      quantity: totalQuantity,
    };
    console.log('Order Completed:', ticket, this.selectedSeats);
    alert(`Order Completed!\nTotal Price: $${totalPrice}`);
  }
}
