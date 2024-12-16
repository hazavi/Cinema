import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { GenericService } from '../../service/generic.service';
import { PostalCode } from '../../models/postalcode';
import { Movie } from '../../models/movie';

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

  constructor(
    private genericService: GenericService<User>,
    private postalService: GenericService<PostalCode>,
    private movieService: GenericService<Movie>,
    private router: Router
  ) {}

  isDashboardContentVisible = true; // Dashboard content is visible by default
  isUserContentVisible = false;

  currentPage = 1;
  itemsPerPage = 10;

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
  toggleUserContent() {
    if (this.isDashboardContentVisible) {
      this.isDashboardContentVisible = false;
      this.isUserContentVisible = true;
    }
  }

  toggleDashboardContent() {
    if (this.isUserContentVisible) {
      this.isUserContentVisible = false;
      this.isDashboardContentVisible = true;
    }
  }
  ngOnInit() {
    // Generic - Get All Users
    this.genericService.getAll('Users').subscribe((data: User[]) => {
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
  }

  // Delete User
  deleteUser(id: number) {
    this.genericService.deletebyid('Users', id).subscribe(() => {
      alert(`User with ID: ${id}, is deleted successfully`);
    });
  }
}
