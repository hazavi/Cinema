import { Genre } from './genre';

export class Movie {
  movieId: number = 0;
  title: string = '';
  description: string = '';
  durationMinutes: number = 0;
  rating: number = 0;
  releaseDate: Date = new Date();
  genres: Genre[] = [];
}
