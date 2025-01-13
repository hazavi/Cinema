export interface MovieResponse {
  movieId: number;
  title: string;
  posterUrl: string;
  description?: string;
  durationMinutes?: number;
  rating?: number;
  releaseDate?: Date;
  genreIds?: number[];
  genreNames?: string;
  isShowing?: boolean;
}
