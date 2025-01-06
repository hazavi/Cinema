import { Component } from '@angular/core';
import { Movie } from '../../models/movie';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { GenericService } from '../../service/generic.service';
import { RouterModule, Router } from '@angular/router';
import { Genre } from '../../models/genre';
import { MovieGenre } from '../../models/moviegenre';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-movie',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-movie.component.html',
  styleUrls: ['./create-movie.component.css'],
})
export class CreateMovieComponent {
  movieList: Movie[] = [];
  genreList: Genre[] = [];
  movieForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private movieService: GenericService<Movie>,
    private movieGenreService: GenericService<MovieGenre>,
    private genreService: GenericService<Genre>,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Fetch genre list from service
    this.genreService.getAll('Genres').subscribe((data: Genre[]) => {
      this.genreList = data;
      console.log('Genres List:', this.genreList);
    });

    // Initialize the movie form with genres as an empty FormArray
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      durationMinutes: ['', [Validators.required, Validators.min(1)]],
      rating: [
        '',
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
      releaseDate: ['', Validators.required],
      genres: this.fb.array([]), // Initialize genres as a FormArray
    });
    console.log('Form initialized:', this.movieForm);
  }

  onGenreChange(event: any, genreId: number): void {
    const genres = this.movieForm.get('genres') as FormArray;
    console.log('Checkbox changed:', genreId, event.target.checked);

    if (genreId !== undefined) {
      if (event.target.checked) {
        if (
          !genres.controls.some((control: any) => control.value === genreId)
        ) {
          genres.push(new FormControl(genreId)); // Add genreId to FormArray
          console.log('Added genreId:', genreId);
        }
      } else {
        const index = genres.controls.findIndex(
          (control: any) => control.value === genreId
        );
        if (index !== -1) {
          genres.removeAt(index); // Remove genreId from FormArray
          console.log('Removed genreId:', genreId);
        }
      }
    } else {
      console.error('Invalid genreId:', genreId);
    }

    console.log('Updated Genres:', this.movieForm.value.genres);
  }

  async onSubmit(): Promise<void> {
    if (this.movieForm.valid) {
      this.isSubmitting = true;

      const selectedGenres = this.movieForm.value.genres;
      console.log('Selected Genres Before Validation:', selectedGenres);

      if (!selectedGenres || selectedGenres.length === 0) {
        alert('At least one genre must be selected.');
        this.isSubmitting = false;
        return;
      }

      const newMovie: Movie = {
        movieId: 0,
        title: this.movieForm.value.title,
        description: this.movieForm.value.description,
        durationMinutes: this.movieForm.value.durationMinutes,
        rating: this.movieForm.value.rating,
        releaseDate: this.movieForm.value.releaseDate,
        movieGenres: [],
      };

      const movieGenres: MovieGenre[] = selectedGenres
        .map((genreId: number) => {
          const genre = this.genreList.find(
            (g: Genre) => g.genreId === genreId
          );
          if (genre) {
            return {
              movieId: 0,
              genreId: genre.genreId,
              genreName: genre.genreName,
            };
          }
          return null;
        })
        .filter(
          (genre: MovieGenre | null): genre is MovieGenre => genre !== null
        );

      if (movieGenres.length === 0) {
        alert('One or more selected genres are invalid.');
        this.isSubmitting = false;
        return;
      }

      try {
        const createdMovie = await this.movieService
          .create('Movies', newMovie)
          .toPromise();

        if (!createdMovie) {
          alert('Error: Movie creation failed.');
          this.isSubmitting = false;
          return;
        }

        const movieId = createdMovie.movieId;

        // Update movieGenres with movieId
        movieGenres.forEach((movieGenre) => {
          movieGenre.movieId = movieId;
        });

        const genreRequests = movieGenres.map((movieGenre) =>
          this.movieGenreService.create('MovieGenres', movieGenre).toPromise()
        );

        await forkJoin(genreRequests).toPromise();
        alert('Movie created successfully with genres.');
        this.router.navigate(['/admin']);
      } catch (error) {
        console.error('Error creating movie:', error);
        alert('An error occurred while creating the movie.');
      } finally {
        this.isSubmitting = false;
      }
    } else {
      alert('Please fill out all required fields.');
    }
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
