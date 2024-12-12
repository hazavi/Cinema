import { Movie } from './movie';

export class Genre {
  genreId: number = 0;
  genreName: string = '';
  movies: Movie[] = [];
}
