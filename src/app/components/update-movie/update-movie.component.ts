import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericService } from '../../service/generic.service';
import { Genre } from '../../models/genre';
import { Movie } from '../../models/movie';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-movie',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-movie.component.html',
  styleUrls: ['./update-movie.component.css'],
})
export class UpdateMovieComponent implements OnInit {
  movieForm: FormGroup;
  genres: Genre[] = [];
  movieId: number | null = null;

  constructor(
    private movieService: GenericService<Movie>,
    private genreService: GenericService<Genre>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.movieForm = new FormGroup({
      posterUrl: new FormControl('', [
        Validators.required,
        Validators.pattern('public/posters/.+'),
      ]),
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
      isShowing: new FormControl(false),
    });
  }

  ngOnInit(): void {
    // Get the movie ID from the URL
    this.route.params.subscribe((params) => {
      this.movieId = +params['id']; // Assign movieId here
      if (this.movieId !== null) {
        this.loadMovie();
      } else {
        console.error('Movie ID is not available');
      }
    });

    // Fetch genres for the select input
    this.genreService.getAll('Genres').subscribe((data) => {
      this.genres = data; // Save genres
      console.log('Fetched genres:', this.genres); // Log genres to verify
    });
  }

  loadMovie(): void {
    if (this.movieId !== null) {
      this.movieService.getbyid('Movies', this.movieId).subscribe((movie) => {
        console.log('Fetched movie:', movie);

        const formattedReleaseDate = movie.releaseDate
          ? new Date(movie.releaseDate).toISOString().split('T')[0]
          : '';

        // Patch the form with the movie data, including genreIds
        this.movieForm.patchValue({
          posterUrl: movie.posterUrl,
          title: movie.title,
          description: movie.description,
          durationMinutes: movie.durationMinutes,
          rating: movie.rating,
          releaseDate: formattedReleaseDate,
          genreIds: movie.genreIds || [], // Ensure genreIds are patched here
          isShowing: movie.isShowing,
        });

        // Log the movie genreIds after patching
        console.log(
          'Movie genreIds after patching:',
          this.movieForm.value.genreIds
        );

        // Mark genres as selected based on genreIds
        if (movie.genreIds && movie.genreIds.length > 0) {
          this.genres.forEach((genre) => {
            genre.selected = movie.genreIds.includes(genre.genreId);
            console.log(
              `Genre ID: ${genre.genreId}, Selected: ${genre.selected}`
            );
          });
        }
      });
    }
  }

  toggleGenreSelection(genreId: number): void {
    const genreIds = this.movieForm.value.genreIds || [];
    const updatedGenreIds = genreIds.includes(genreId)
      ? genreIds.filter((id: number) => id !== genreId)
      : [...genreIds, genreId];

    this.movieForm.patchValue({ genreIds: updatedGenreIds });

    // Log the updated genreIds after toggle
    console.log('Updated genreIds after toggle:', updatedGenreIds);
  }

  onSubmit(): void {
    if (this.movieForm.invalid) return;

    const movieData = {
      posterUrl: this.movieForm.value.posterUrl,
      title: this.movieForm.value.title,
      description: this.movieForm.value.description,
      durationMinutes: this.movieForm.value.durationMinutes,
      rating: this.movieForm.value.rating,
      releaseDate: new Date(this.movieForm.value.releaseDate),
      isShowing: this.movieForm.value.isShowing,
      genreIds: this.movieForm.value.genreIds, // Directly use genreIds instead of movieGenres
    };

    // Payload now correctly includes genreIds
    const payload: Movie = {
      ...movieData,
      movieId: this.movieId ?? 0,
    };

    console.log('Payload to update movie:', payload);

    if (this.movieId) {
      this.movieService.updatebyid('Movies', this.movieId, payload).subscribe(
        (updatedMovie) => {
          alert('Movie updated successfully');
          this.movieForm.patchValue({
            ...updatedMovie,
            releaseDate: new Date(updatedMovie.releaseDate)
              .toISOString()
              .split('T')[0],
            genreIds: updatedMovie.genreIds, // Now use genreIds from the updated movie
            isShowing: updatedMovie.isShowing,
          });
          console.log('Updated movie form data:', this.movieForm.value);

          this.router.navigate(['/admin']);
        },
        (error) => {
          alert('Error updating movie');
          console.error(error);
        }
      );
    } else {
      alert('Invalid movie ID');
    }
  }
}
