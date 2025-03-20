import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../service/generic.service';
import { Movie } from '../../models/movie';
import { MovieGenre } from '../../models/moviegenre';
import { Genre } from '../../models/genre';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-showing',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './showing.component.html',
  styleUrls: ['./showing.component.css'],
})
export class ShowingComponent implements OnInit {
  movies: Movie[] = []; // Stores movies that are currently showing
  genres: Genre[] = []; // Stores all genres
  movieGenres: MovieGenre[] = []; // Stores all movie-genre relationships
  movieAvailable: Movie | null = null;
  isLoading: boolean = false;

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
    this.isLoading = true; // Start loading

    this.movieService.getAll('Movies').subscribe((movies) => {
      // Sort movies by release date in descending order (latest first)
      const sortedMovies = movies.sort((a, b) => {
        if (!a.releaseDate || !b.releaseDate) {
          return 0; // Handle cases where releaseDate might be undefined
        }
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      });
    
      // Fetch only the last 5 movies (latest 4 movies based on release date)
      this.movies = sortedMovies.slice(0, 5);

      this.movies = movies.filter((movie) => movie.isShowing); 
      this.fetchGenres(); 
    });
  }

  private fetchGenres(): void {
    this.genreService.getAll('Genres').subscribe((genres) => {
      this.genres = genres;
      this.fetchMovieGenres(); // Fetch movie-genre relationships after genres
      this.isLoading = false; // Stop loading
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
