import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../service/generic.service';
import { Movie } from '../../models/movie';
import { MovieGenre } from '../../models/moviegenre';
import { Genre } from '../../models/genre';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-showing',
  imports: [CommonModule],
  templateUrl: './showing.component.html',
  styleUrls: ['./showing.component.css'],
})
export class ShowingComponent implements OnInit {
  movies: Movie[] = []; // Stores movies that are currently showing
  genres: Genre[] = []; // Stores all genres
  movieGenres: MovieGenre[] = []; // Stores all movie-genre relationships

  constructor(
    private movieService: GenericService<Movie>,
    private genreService: GenericService<Genre>,
    private movieGenreService: GenericService<MovieGenre>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchMovies(); // Start by fetching movies
  }

  // Fetches the list of movies that are currently showing
  private fetchMovies(): void {
    this.movieService.getAll('Movies').subscribe((movies) => {
      this.movies = movies.filter((movie) => movie.isShowing);
      this.fetchGenres(); // Fetch genres once movies are available
    });
  }

  // Fetches the list of all genres
  private fetchGenres(): void {
    this.genreService.getAll('Genres').subscribe((genres) => {
      this.genres = genres;
      this.fetchMovieGenres(); // Fetch movie-genre relationships after genres
    });
  }

  // Fetches the list of movie-genre relationships
  private fetchMovieGenres(): void {
    this.movieGenreService.getAll('MovieGenre').subscribe((movieGenres) => {
      this.movieGenres = movieGenres;
      this.assignGenreNames(); // Assign genre names after all data is available
    });
  }

  // Assigns genre names to each movie
  private assignGenreNames(): void {
    this.movies.forEach((movie) => {
      // Get genre IDs associated with the current movie
      const relatedGenreIds = this.movieGenres
        .filter((mg) => mg.movieId === movie.movieId)
        .map((mg) => mg.genreId);

      // Map genre IDs to genre names
      const relatedGenreNames = this.genres
        .filter((genre) => relatedGenreIds.includes(genre.genreId))
        .map((genre) => genre.genreName)
        .join(', ');

      // Assign genre names or a fallback message
      movie.genreNames = relatedGenreNames || 'No genres available';
    });
  }
  viewMovie(movieId: number): void {
    // Navigate to the view-movie component with the movieId as a parameter
    this.router.navigate(['/view-movie', movieId]);
  } 
  // Add query paramters to the URL => /view-movie/:movieId?city={cityName}
}
