import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { GenericService } from '../../service/generic.service';
import { MovieResponse } from '../../models/movieresponse';
import { Genre } from '../../models/genre';
import { MovieGenre } from '../../models/moviegenre';

interface Movie {
  id: number;
  title: string;
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  slideInterval: any;
  slides: string[] = [
    'assets/imgs/c1.jpg',
    'assets/imgs/c2.jpg',
    'assets/imgs/c3.jpg',
  ];

  movies: MovieResponse[] = [];
  highestRatedMovies: MovieResponse[] = [];
  movieGenres: MovieGenre[] = [];
  genres: Genre[] = [];

  isLogin = localStorage.getItem('isLogin') === 'true';

  constructor(
    private movieService: GenericService<MovieResponse>,
    private movieGenreService: GenericService<MovieGenre>,
    private router: Router,
    private genreService: GenericService<Genre>,
    
  ) {}

  ngOnInit(): void {
    this.startSlideshow();
    this.movieService.getAll('Movies').subscribe((data: MovieResponse[]) => {
      // Sort movies by release date in descending order (latest first)
      const sortedMovies = data.sort((a, b) => {
        if (!a.releaseDate || !b.releaseDate) {
          return 0; // Handle cases where releaseDate might be undefined
        }
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      });
    
      // Fetch only the last 5 movies (latest 4 movies based on release date)
      this.movies = sortedMovies.slice(0, 5);

      // Fetch only the top 5 highest rated movies
      const sortedMoviesByRating = data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      this.highestRatedMovies = sortedMoviesByRating.slice(0, 5);
      this.fetchGenres();

    });
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startSlideshow(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }
  viewMovie(movieId: number, movieName: string): void {
    const formattedName = movieName.replace(/\s+/g, '-').toLowerCase(); // Format name for URL
    this.router.navigate(['/movie', movieId, formattedName]); // Navigate with both id and movieName
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

    this.highestRatedMovies.forEach((movie) => {
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

  

}
