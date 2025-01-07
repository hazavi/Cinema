import { Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GenericService } from '../../service/generic.service';
import { RouterModule } from '@angular/router';
import { Genre } from '../../models/genre';
import { MovieGenre } from '../../models/moviegenre';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create-movie',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-movie.component.html',
  styleUrls: ['./create-movie.component.css'],
})
export class CreateMovieComponent implements OnInit {
  movieForm: FormGroup;
  genres: Genre[] = [];

  constructor(
    private movieService: GenericService<Movie>,
    private genreService: GenericService<Genre>
  ) {
    this.movieForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      durationMinutes: new FormControl('', [
        Validators.required,
        Validators.min(1),
      ]),
      rating: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(10),
      ]),
      releaseDate: new FormControl('', Validators.required),
      genreIds: new FormControl([], Validators.required),
    });
  }

  ngOnInit(): void {
    this.genreService.getAll('Genres').subscribe(
      (data: Genre[]) => {
        this.genres = data;
      },
      (error) => {
        console.error('Error fetching genres:', error);
      }
    );
  }

  logSelectedGenres(selectedGenres: any[]): void {
    console.log('Selected genres:', selectedGenres);
  }

  onSubmit(): void {
    if (this.movieForm.invalid) {
      console.log('Form is invalid:', this.movieForm.errors); // Debugging form errors
      return; // Early exit if form is invalid
    }

    // Log the form data to see what's being sent
    console.log('Form Values:', this.movieForm.value);

    const genreIds: number[] = this.movieForm.value.genreIds;

    // Create the payload to send to the backend
    const payload = {
      title: this.movieForm.value.title,
      description: this.movieForm.value.description,
      durationMinutes: this.movieForm.value.durationMinutes,
      rating: this.movieForm.value.rating,
      releaseDate: new Date(this.movieForm.value.releaseDate)
        .toISOString()
        .split('T')[0], // Trim the time part
      genreIds: genreIds,
    };

    console.log('Payload:', payload);

    this.movieService.create2('Movies', payload).subscribe(
      (response) => {
        alert('Movie created successfully');
        this.resetForm();
      },
      (error) => {
        alert('Error creating movie');
        console.error('Error:', error);
        // Log additional error details if available
        if (error?.error?.message) {
          console.error('Backend message:', error.error.message);
        }
      }
    );
  }

  resetForm(): void {
    this.movieForm.reset();
  }
}
