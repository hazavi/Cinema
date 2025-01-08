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
  movieDetails: Movie | null = null;
  genres: Genre[] = [];
  genreNames: string = '';
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: GenericService<Movie>,
    private genreService: GenericService<Genre>,
    private movieGenreService: GenericService<MovieGenre>
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ id }) => {
      this.movieId = +id;
      this.fetchMovieDetails();
      this.fetchGenresForMovie();
    });
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.errorMessage = message;
    this.isLoading = false;
  }

  private fetchMovieDetails(): void {
    this.movieService.getbyid('Movies', this.movieId).subscribe(
      (data) => {
        this.movieDetails = data;
        this.isLoading = false;
      },
      (error) =>
        this.handleError(
          'Failed to fetch movie details. Please try again later.',
          error
        )
    );
  }

  private fetchGenresForMovie(): void {
    this.genreService.getAll('Genres').subscribe(
      (allGenres) => {
        this.genres = allGenres;
        this.fetchMovieGenres();
      },
      (error) =>
        this.handleError(
          'Failed to fetch genres. Please try again later.',
          error
        )
    );
  }

  private fetchMovieGenres(): void {
    this.movieGenreService.getAll('MovieGenre').subscribe(
      (movieGenres) => {
        const movieGenreIds = movieGenres
          .filter((mg) => mg.movieId === this.movieId)
          .map((mg) => mg.genreId);

        // Assign genre names to the movie
        this.genreNames = movieGenreIds.length
          ? this.getGenreNames(movieGenreIds)
          : 'No genres available.';

        // Update movieDetails with genreNames
        if (this.movieDetails) {
          this.movieDetails.genreNames = this.genreNames;
        }
        
        this.isLoading = false;
      },
      (error) =>
        this.handleError(
          'Failed to fetch movie genres. Please try again later.',
          error
        )
    );
  }

  private getGenreNames(genreIds: number[]): string {
    return this.genres
      .filter((genre) => genreIds.includes(genre.genreId))
      .map((genre) => genre.genreName)
      .join(', ');
  }
}
