import { Movie } from './movie';
import { MovieGenre } from './moviegenre';

export class Genre {
  genreId: number = 0;
  genreName: string = '';
  selected?: boolean = false;
  // movieGenres: MovieGenre[] = [];
}
