import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenericService } from '../../service/generic.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userId: number = 0;
  userFirstName: string | null = null;
  userLastName: string | null = null;
  userEmail: string | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private userService: GenericService<User> // Inject GenericService with User model
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ id }) => {
      this.userId = +id; // Get userId from route params
      this.fetchUserDetails();
    });
  }

  fetchUserDetails(): void {
    this.userService.getbyid('Users', this.userId).subscribe(
      (userData) => {
        this.userFirstName = userData.firstName;
        this.userLastName = userData.lastName;
        this.userEmail = userData.email;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching user details:', error);
        this.loading = false;
      }
    );
  }
}
