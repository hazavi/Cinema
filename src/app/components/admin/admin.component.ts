import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { GenericService } from '../../service/generic.service';
import { PostalCode } from '../../models/postalcode';
import { Movie } from '../../models/movie';
import { Genre } from '../../models/genre';
import { MovieGenre } from '../../models/moviegenre';
import { Address } from '../../models/address';
import { Theater } from '../../models/theater';
import { Showtime } from '../../models/showtime';
import { Seat } from '../../models/seat';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  providers: [DatePipe],
})
export class AdminComponent {
  userList: User[] = [];
  postalCodeList: PostalCode[] = [];
  movieList: Movie[] = [];
  genreList: Genre[] = [];
  movieGenreList: MovieGenre[] = [];
  addressList: Address[] = [];
  theaterList: Theater[] = [];
  showtimeList: Showtime[] = [];
  seatList: Seat[] = [];
  activeContent: string = 'dashboard'; // Default content to display

  constructor(
    private userService: GenericService<User>,
    private postalService: GenericService<PostalCode>,
    private movieService: GenericService<Movie>,
    private genreService: GenericService<Genre>,
    private movieGenreService: GenericService<MovieGenre>,
    private addressService: GenericService<Address>,
    private theaterService: GenericService<Theater>,
    private showtimeService: GenericService<Showtime>,
    private seatService: GenericService<Seat>,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  currentPage = 1;
  itemsPerPage = 10;

  showContent(content: string): void {
    this.activeContent = content;
  }
  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.userList.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Math.ceil(this.userList.length / this.itemsPerPage);
  }
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  ngOnInit() {
    // Generic - Get All Users
    this.userService.getAll('Users').subscribe((data: User[]) => {
      this.userList = data;
    });
    // Generic - Get All PostalCodes
    this.postalService.getAll('PostalCodes').subscribe((data: PostalCode[]) => {
      this.postalCodeList = data;
    });
    // Generic - Get All Movies
    this.movieService.getAll('Movies').subscribe((data: Movie[]) => {
      this.movieList = data;
    });
    // Generic - Get All Genre
    this.genreService.getAll('Genres').subscribe((data: Genre[]) => {
      this.genreList = data;
    });
    // Generic - Get All MovieGenre
    this.movieGenreService
      .getAll('MovieGenre')
      .subscribe((data: MovieGenre[]) => {
        this.movieGenreList = data;
      });
    // Generic - Get All Address
    this.addressService.getAll('Addresses').subscribe((data: Address[]) => {
      this.addressList = data;
    });
    // Generic - Get All Theater
    this.theaterService.getAll('Theaters').subscribe((data: Theater[]) => {
      this.theaterList = data;
    });
    // Generic - Get All Showtime
    this.showtimeService.getAll('Showtimes').subscribe((data: Showtime[]) => {
      this.showtimeList = data;
    });
    // Generic - Get All Seat
    this.seatService.getAll('Seats').subscribe((data: Seat[]) => {
      this.seatList = data;
    });
  }
  getPostalName(postalCodeId: number): string {
    const postal = this.postalCodeList.find(
      (pc) => pc.postalCodeId === postalCodeId
    );
    return postal ? postal.name : 'Unknown Postal Code';
  }
  // Delete operations

  // Delete User
  deleteUser(id: number) {
    this.userService.deletebyid('Users', id).subscribe(() => {
      alert(`User with ID: ${id}, is deleted successfully`);
    });
  }
  // Delete Movie
  deleteMovie(id: number) {
    this.movieService.deletebyid('Movies', id).subscribe(() => {
      alert(`Movie with ID: ${id}, is deleted successfully`);
    });
  }
  // Delete Genre
  deleteGenre(id: number) {
    this.genreService.deletebyid('Genres', id).subscribe(() => {
      alert(`Genre with ID: ${id}, is deleted successfully`);
    });
  }
  // Delete Postal Code
  deletePostalCode(id: number) {
    this.postalService.deletebyid('PostalCodes', id).subscribe(() => {
      alert(`Postal Code with ID: ${id}, is deleted successfully`);
    });
  }
  // Delete Address
  deleteAddress(id: number) {
    this.addressService.deletebyid('Addresses', id).subscribe(() => {
      alert(`Address with ID: ${id}, is deleted successfully`);
    });
  }
  // Delete Theater
  deleteTheater(id: number) {
    this.theaterService.deletebyid('Theaters', id).subscribe(() => {
      alert(`Theater with ID: ${id}, is deleted successfully`);
    });
  }
  // Delete Showtime
  deleteShowtime(id: number) {
    this.showtimeService.deletebyid('Showtimes', id).subscribe(() => {
      alert(`Showtime with ID: ${id}, is deleted successfully`);
    });
  }
  // Delete Seat
  deleteSeat(id: number) {
    this.seatService.deletebyid('Seats', id).subscribe(() => {
      alert(`Seat with ID: ${id}, is deleted successfully`);
    });
  }
}
