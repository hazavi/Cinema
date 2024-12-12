import { Component } from '@angular/core';
import { GenericService } from '../../service/generic.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { PostalCode } from '../../models/postalcode';

@Component({
  selector: 'app-update-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css',
})
export class UpdateUserComponent {
  userId!: number;
  userDetails!: User | null;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  postalCodeList: PostalCode[] = [];

  constructor(
    private route: ActivatedRoute,
    private genericService: GenericService<User>,
    private postalService: GenericService<PostalCode>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = +params['id'];
      this.fetchUserDetails();
    });

    this.postalService.getAll('PostalCodes').subscribe((data: PostalCode[]) => {
      this.postalCodeList = data;
    });
  }
  navigateToUser(): void {
    this.router.navigate(['/users']);
  }

  fetchUserDetails(): void {
    this.genericService.getbyid('Users', this.userId).subscribe(
      (data: User) => {
        this.userDetails = data;
        this.isLoading = false;
        console.log('Fetched user details:', this.userDetails); // Check if postalCodeId is correct here
      },
      (error) => {
        console.error('Error fetching user details:', error);
        this.errorMessage =
          'Failed to fetch user details. Please try again later.';
        this.isLoading = false;
      }
    );
  }
  updateUser(): void {
    if (this.userDetails) {
      console.log('User details before update:', this.userDetails); // Log the userDetails to confirm the postalCodeId is there
      console.log('Postal Code ID:', this.userDetails.postalCodeId); // Log postalCodeId for debugging

      this.genericService
        .updatebyid('Users', this.userId, this.userDetails)
        .subscribe(
          (updatedUser) => {
            alert('User updated successfully!');
            this.router.navigate(['/users']);
          },
          (error) => {
            console.error('Error updating user:', error);
            this.errorMessage = 'Failed to update user. Please try again.';
          }
        );
    }
  }
}
