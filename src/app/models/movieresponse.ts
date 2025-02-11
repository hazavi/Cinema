export interface MovieResponse {
  movieId: number;
  title: string;
  posterUrlBase64: string;
  description?: string;
  durationMinutes?: number;
  rating?: number;
  releaseDate?: Date;
  genreIds?: number[];
  genreNames?: string;
  isShowing?: boolean;
}
