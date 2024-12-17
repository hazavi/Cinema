import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { GenericService } from '../../service/generic.service';
import { PostalCode } from '../../models/postalcode';
import { Movie } from '../../models/movie';
import { Genre } from '../../models/genre';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  userList: User[] = [];
  postalCodeList: PostalCode[] = [];
  movieList: Movie[] = [];
  genreList: Genre[] = [];
  activeContent: string = 'dashboard'; // Default content to display

  constructor(
    private userService: GenericService<User>,
    private postalService: GenericService<PostalCode>,
    private movieService: GenericService<Movie>,
    private genreService: GenericService<Genre>,
    private router: Router
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
  }

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
}
