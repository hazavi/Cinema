import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenericService } from '../../service/generic.service';
import { Movie } from '../../models/movie';
import { Genre } from '../../models/genre';
import { MovieGenre } from '../../models/moviegenre';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-movie',
  imports: [DatePipe, CommonModule],
  templateUrl: './view-movie.component.html',
  styleUrls: ['./view-movie.component.css'],
})
export class ViewMovieComponent {
  movieId!: number;
  movieDetails!: Movie | null;
  genres: Genre[] = [];
  genreNames: string = '';
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private genericMovieService: GenericService<Movie>, // Correct service for movies
    private genericGenreService: GenericService<Genre>, // Correct service for genres
    private genericMovieGenreService: GenericService<MovieGenre> // Service for movie-genre relations
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.movieId = +params['id'];
      this.fetchMovieDetails();
      this.fetchGenresForMovie();
    });
  }

  // Consolidated error handling function
  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.errorMessage = message;
    this.isLoading = false;
  }

  // Fetch movie details
  fetchMovieDetails(): void {
    this.genericMovieService.getbyid('Movies', this.movieId).subscribe(
      (data: Movie) => {
        this.movieDetails = data;

        // Extract genre names from movieGenres
        this.genreNames =
          data.movieGenres.map((mg) => mg.genreName).join(', ') ||
          'No genres available.';

        this.isLoading = false;
      },
      (error) =>
        this.handleError(
          'Failed to fetch movie details. Please try again later.',
          error
        )
    );
  }

  // Fetch genres based on movie genres (movieId and genreId mapping)
  fetchGenresForMovie(): void {
    // Fetch all genres and movie-genre relations
    this.genericGenreService.getAll('Genres').subscribe(
      (allGenres: Genre[]) => {
        console.log('All genres fetched:', allGenres); // Debug log
        this.genres = allGenres;

        // Fetch the movie-genre relations
        this.genericMovieGenreService.getAll('MovieGenres').subscribe(
          (movieGenres: MovieGenre[]) => {
            console.log('Movie genres fetched:', movieGenres); // Debug log

            // Filter movieGenres to find those associated with the current movie
            const movieGenreIds = movieGenres
              .filter((mg) => mg.movieId === this.movieId)
              .map((mg) => mg.genreId);

            console.log('Filtered movie genre IDs:', movieGenreIds); // Debug log

            if (movieGenreIds.length === 0) {
              console.log('No genres found for this movie.');
              this.genreNames = 'No genres available.';
              this.isLoading = false;
              return;
            }

            // Map genre IDs to genre names
            this.genreNames = this.genres
              .filter((genre) => movieGenreIds.includes(genre.genreId))
              .map((genre) => genre.genreName)
              .join(', ');

            console.log('Mapped genre names:', this.genreNames); // Debug log

            if (!this.genreNames) {
              this.genreNames = 'No genres available.';
            }

            this.isLoading = false;
          },
          (error) =>
            this.handleError(
              'Failed to fetch movie genres. Please try again later.',
              error
            )
        );
      },
      (error) =>
        this.handleError(
          'Failed to fetch genres. Please try again later.',
          error
        )
    );
  }
}
