import { Component } from '@angular/core';
import { Theater } from '../../models/theater';
import { Seat } from '../../models/seat';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericService } from '../../service/generic.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-seat',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-seat.component.html',
  styleUrl: './create-seat.component.css',
})
export class CreateSeatComponent {
  seatForm: FormGroup;
  theaters: Theater[] = [];
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private theaterService: GenericService<Theater>,
    private seatService: GenericService<Seat>,
    private router: Router
  ) {
    this.seatForm = this.fb.group({
      theaterId: [null, Validators.required],
      rowNumber: [null, [Validators.required, Validators.min(1)]],
      seatNumber: [null, [Validators.required, Validators.min(1)]],
      isAvailable: [true, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadTheaters();
  }

  // Load theaters
  loadTheaters(): void {
    this.theaterService.getAll('Theaters').subscribe({
      next: (data) => (this.theaters = data),
      error: (err) => console.error('Failed to load theaters:', err),
    });
  }

  // Create Seat
  createSeat(): void {
    if (this.seatForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const newSeat: Seat = this.seatForm.value;

    this.seatService.create('Seats', newSeat).subscribe({
      next: (response) => {
        this.seatForm.reset();
        this.isSubmitting = false;
        alert('Seat created successfully!');
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('Failed to create seat:', err);
        this.isSubmitting = false;
        alert('Failed to create seat. Please try again.');
      },
    });
  }
}
