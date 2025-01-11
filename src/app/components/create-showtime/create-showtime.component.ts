import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Theater } from '../../models/theater';
import { Movie } from '../../models/movie';
import { GenericService } from '../../service/generic.service';
import { Showtime } from '../../models/showtime';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-showtime',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-showtime.component.html',
  styleUrl: './create-showtime.component.css',
})
export class CreateShowtimeComponent {
  showtimeForm: FormGroup;
  theaters: Theater[] = [];
  movies: Movie[] = [];
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private showtimeService: GenericService<Showtime>,
    private theaterService: GenericService<Theater>,
    private movieService: GenericService<Movie>,
    private router: Router
  ) {
    this.showtimeForm = this.fb.group({
      theaterId: [null, Validators.required],
      movieId: [null, Validators.required],
      startTime: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadTheaters();
    this.loadMovies();
  }
  // Load theaters
  loadTheaters(): void {
    this.theaterService.getAll('Theaters').subscribe({
      next: (data) => (this.theaters = data),
      error: (err) => console.error('Failed to load theaters:', err),
    });
  }

  // Load movies
  loadMovies(): void {
    this.movieService.getAll('Movies').subscribe({
      next: (data) => (this.movies = data.filter((movie) => movie.isShowing)),
      error: (err) => console.error('Failed to load movies:', err),
    });
  }

  // Create Showtime
  createShowtime(): void {
    if (this.showtimeForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const newShowtime: Showtime = this.showtimeForm.value;

    this.showtimeService.create('Showtimes', newShowtime).subscribe({
      next: (response) => {
        this.showtimeForm.reset();
        this.isSubmitting = false;
        alert('Showtime created successfully!');
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('Failed to create showtime:', err);
        this.isSubmitting = false;
        alert('Failed to create showtime. Please try again.');
      },
    });
  }
}
