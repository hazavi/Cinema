import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenericService } from '../../service/generic.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-user',
  imports: [CommonModule],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css'
})
export class ViewUserComponent {
  userId!: number;
  userDetails!: User | null;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private genericService: GenericService<User>
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = +params['id'];
      this.fetchUserDetails();
    });
  }

  fetchUserDetails(): void {
    this.genericService.getbyid('Users', this.userId).subscribe(
      (data: User) => {
        this.userDetails = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching user details:', error);
        this.errorMessage = 'Failed to fetch user details. Please try again later.';
        this.isLoading = false;
      }
    );
  }
}
