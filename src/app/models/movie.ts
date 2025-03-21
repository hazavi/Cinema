import { Genre } from './genre';
import { MovieGenre } from './moviegenre';

export class Movie {
  movieId: number = 0;
  posterUrlBase64?: string | null;
  title: string = '';
  description: string = '';
  durationMinutes: number = 0;
  rating: number = 0;
  releaseDate: Date = new Date();
  genreIds: number[] = [];
  genreNames?: string;
  isShowing: boolean = false;
  constructor(init?: Partial<Movie>) {
    Object.assign(this, init);
  }
}
// movieGenres: MovieGenre[] = [];
// Director
// Distributed by
