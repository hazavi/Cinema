import { Genre } from './genre';
import { MovieGenre } from './moviegenre';

export class Movie {
  movieId: number = 0;
  posterUrl: string = '';
  title: string = '';
  description: string = '';
  durationMinutes: number = 0;
  rating: number = 0;
  releaseDate: Date = new Date();
  genreIds: number[] = [];
  genreNames?: string;
  isShowing: boolean = false;
}
  // movieGenres: MovieGenre[] = [];
  // Director
  // Distributed by