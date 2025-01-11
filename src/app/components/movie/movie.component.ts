import { Component } from '@angular/core';
import { Movie } from '../../models/movie';
import { Showtime } from '../../models/showtime';
import { PostalCode } from '../../models/postalcode';
import { Address } from '../../models/address';
import { Theater } from '../../models/theater';
import { MovieGenre } from '../../models/moviegenre';
import { Genre } from '../../models/genre';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from '../../service/generic.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css'],
  providers: [DatePipe],
})
export class MovieComponent {
  movie!: Movie;
  showtimes: Showtime[] = [];
  addresses: Address[] = [];
  postalCodes: PostalCode[] = [];
  theaters: Theater[] = [];
  genres: Genre[] = [];
  selectedCityId: number = 0;
  days: any[] = [];
  genreNames: string = '';
  movieDetails: Movie | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: GenericService<Movie>,
    private movieGenreService: GenericService<MovieGenre>,
    private showtimeService: GenericService<Showtime>,
    private postalCodeService: GenericService<PostalCode>,
    private addressService: GenericService<Address>,
    private theaterService: GenericService<Theater>,
    private genreService: GenericService<Genre>,
    private router: Router,
    public datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id');
    const movieName = decodeURIComponent(
      this.route.snapshot.paramMap.get('movieName') || ''
    );

    if (movieId && movieName) {
      this.loadMovie(Number(movieId), movieName);
      this.loadPostalCodes();
      this.loadAddresses();
      this.loadTheaters();
      this.calculateDays();
    }
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.errorMessage = message;
  }

  private loadMovie(movieId: number, movieName: string): void {
    this.movieService.getAll('Movies').subscribe({
      next: (movies) => {
        this.movie = movies.find((m) => m.movieId === movieId) || this.movie;
        if (this.movie.movieId) {
          this.loadMovieGenres();
          this.loadShowtimes(this.movie.movieId);
        }
      },
      error: (err) => console.error('Error loading movies:', err),
    });
  }

  private loadMovieGenres(): void {
    this.movieGenreService.getAll('MovieGenre').subscribe({
      next: (movieGenres) => {
        const movieGenreIds = movieGenres
          .filter((mg) => mg.movieId === this.movie.movieId)
          .map((mg) => mg.genreId);

        this.genreService.getAll('Genres').subscribe({
          next: (allGenres) => {
            this.genreNames = this.getGenreNames(movieGenreIds, allGenres);
            this.movieDetails = {
              ...this.movie,
              genreNames: this.genreNames,
            };
          },
          error: (error) =>
            this.handleError(
              'Failed to fetch genres. Please try again later.',
              error
            ),
        });
      },
      error: (error) =>
        this.handleError(
          'Failed to fetch movie genres. Please try again later.',
          error
        ),
    });
  }

  private getGenreNames(genreIds: number[], allGenres: Genre[]): string {
    return allGenres
      .filter((genre) => genreIds.includes(genre.genreId))
      .map((genre) => genre.genreName)
      .join(', ');
  }

  loadShowtimes(movieId: number, cityId: number = 0): void {
    this.showtimeService.getAll('Showtimes').subscribe({
      next: (showtimes) => {
        this.showtimes = showtimes.filter(
          (showtime) => showtime.movieId === movieId
        );
        if (cityId) {
          this.showtimes = this.filterShowtimesByCity();
        }
        this.mapPostalCodeNamesToShowtimes();
      },
      error: (err) => console.error('Error loading showtimes:', err),
    });
  }

  private loadPostalCodes(): void {
    this.postalCodeService.getAll('PostalCodes').subscribe({
      next: (postalCodes) => (this.postalCodes = postalCodes),
    });
  }

  private loadAddresses(): void {
    this.addressService.getAll('Addresses').subscribe({
      next: (addresses) => (this.addresses = addresses),
    });
  }

  private loadTheaters(): void {
    this.theaterService.getAll('Theaters').subscribe({
      next: (theaters) => (this.theaters = theaters),
    });
  }

  private mapPostalCodeNamesToShowtimes(): void {
    this.showtimes.forEach((showtime) => {
      const theater = this.theaters.find(
        (t) => t.theaterId === showtime.theaterId
      );
      const address = this.addresses.find(
        (a) => a.addressId === theater?.addressId
      );
      const postalCode = this.postalCodes.find(
        (p) => p.postalCodeId === address?.postalCodeId
      );
      if (postalCode) showtime['postalCodeName'] = postalCode.name;
    });
  }

  private filterShowtimesByCity(): Showtime[] {
    return this.showtimes.filter((showtime) => {
      const theater = this.theaters.find(
        (t) => t.theaterId === showtime.theaterId
      );
      const address = this.addresses.find(
        (a) => a.addressId === theater?.addressId
      );
      return (
        this.selectedCityId === 0 ||
        (address && +address.postalCodeId === +this.selectedCityId)
      );
    });
  }

  private calculateDays(): void {
    const today = new Date();
    this.days = Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      return {
        date: this.datePipe.transform(day, 'd'),
        month: this.datePipe.transform(day, 'MMM'),
        fullDate: day,
      };
    });
  }

  getShowtimesForDay(date: string): Showtime[] {
    return this.filterShowtimesByCity().filter(
      (showtime) => this.datePipe.transform(showtime.startTime, 'd') === date
    );
  }

  durationToHoursMinutes(durationMinutes: number): string {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}hr ${minutes}min`;
  }
  getLocation(theaterId: number): string {
    const theater = this.theaters.find((t) => t.theaterId === theaterId);
    return theater ? theater.location : 'Location not available';
  }
  getTheaterName(theaterId: number): string {
    const theater = this.theaters.find((t) => t.theaterId === theaterId);
    return theater ? theater.name : 'Theater Name not available';
  }
  getTheaterNameByPostalCode(postalCodeId: number): string {
    const theater = this.theaters.find(
      (t) => t.addressId === this.addresses.find((a) => a.postalCodeId === postalCodeId)?.addressId
    );
    return theater ? theater.name : 'Not available';
  }
  onShowtimeClick(showtime: Showtime): void {
    this.router.navigate(['/order', showtime.showtimeId]);
  }
}
