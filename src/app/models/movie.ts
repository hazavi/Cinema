import { Genre } from './genre';
import { MovieGenre } from './moviegenre';

export class Movie {
  movieId: number = 0;
  title: string = '';
  description: string = '';
  durationMinutes: number = 0;
  rating: number = 0;
  releaseDate: Date = new Date();
  genreIds: number[] = [];
  // movieGenres: MovieGenre[] = [];
  // Director
  // Distributed by
}
