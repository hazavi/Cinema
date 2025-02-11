import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../service/generic.service';
import { Movie } from '../../models/movie';
import { MovieGenre } from '../../models/moviegenre';
import { Genre } from '../../models/genre';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-showing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './showing.component.html',
  styleUrls: ['./showing.component.css'],
})
export class ShowingComponent implements OnInit {
  movies: Movie[] = []; // Stores movies that are currently showing
  genres: Genre[] = []; // Stores all genres
  movieGenres: MovieGenre[] = []; // Stores all movie-genre relationships
  movieAvailable: Movie | null = null;

  constructor(
    private movieService: GenericService<Movie>,
    private genreService: GenericService<Genre>,
    private movieGenreService: GenericService<MovieGenre>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchMovies(); // Fetch movies on initialization
  }

  private fetchMovies(): void {
    this.movieService.getAll('Movies').subscribe((movies) => {
      
      this.movies = movies.filter((movie) => movie.isShowing); // Filter currently showing movies
      this.fetchGenres(); // Fetch genres after movies
    });
  }

  private fetchGenres(): void {
    this.genreService.getAll('Genres').subscribe((genres) => {
      this.genres = genres;
      this.fetchMovieGenres(); // Fetch movie-genre relationships after genres
    });
  }

  private fetchMovieGenres(): void {
    this.movieGenreService.getAll('MovieGenre').subscribe((movieGenres) => {
      this.movieGenres = movieGenres;
      this.assignGenreNames(); // Assign genre names to movies after data fetch
    });
  }

  private assignGenreNames(): void {
    this.movies.forEach((movie) => {
      const relatedGenreIds = this.movieGenres
        .filter((mg) => mg.movieId === movie.movieId)
        .map((mg) => mg.genreId);

      const relatedGenreNames = this.genres
        .filter((genre) => relatedGenreIds.includes(genre.genreId))
        .map((genre) => genre.genreName)
        .join(', ');

      movie.genreNames = relatedGenreNames || 'No genres available';
    });
  }


  viewMovie(movieId: number, movieName: string): void {
    const formattedName = movieName.replace(/\s+/g, '-').toLowerCase(); // Format name for URL
    this.router.navigate(['/movie', movieId, formattedName]); // Navigate with both id and movieName
  }
  
}
