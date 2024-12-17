import { Component } from '@angular/core';
import { Movie } from '../../models/movie';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GenericService } from '../../service/generic.service';
import { RouterModule, Router } from '@angular/router';
import { Genre } from '../../models/genre';

@Component({
  selector: 'app-create-movie',
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './create-movie.component.html',
  styleUrl: './create-movie.component.css',
})
export class CreateMovieComponent {
  movieList: Movie[] = [];
  genreList: Genre[] = [];
  movieForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private movieService: GenericService<Movie>,
    private genreService: GenericService<Genre>,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      durationMinutes: ['', Validators.required],
      rating: [
        '',
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
      releaseDate: ['', Validators.required],
      genres: [[], Validators.required],
    });

    this.movieService.getAll('Movies').subscribe((data: Movie[]) => {
      this.movieList = data;
    });

    this.genreService.getAll('Genres').subscribe((data: Genre[]) => {
      this.genreList = data;
    });
  }

  onSubmit(): void {
    if (this.movieForm.valid) {
      this.isSubmitting = true;
      const selectedGenreIds = this.movieForm.value.genres;
      const selectedGenres = this.genreList.filter((genre) =>
        selectedGenreIds.includes(genre.genreId)
      );

      const newMovie = {
        ...this.movieForm.value,
        genres: selectedGenres,
      };

      this.movieService.create('Movies', newMovie).subscribe(
        (response) => {
          console.log('Movie Created Successfully', response);
          alert('Movie Created Successfully');
          this.router.navigate(['/admin']);
        },
        (error) => {
          console.error('Error creating movie:', error);
          alert('An error occurred while creating the movie.');
        },
        () => {
          this.isSubmitting = false;
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
