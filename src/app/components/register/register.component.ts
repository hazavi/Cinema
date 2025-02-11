import { Component, OnInit } from '@angular/core';
import { RegisterModel } from '../../models/registermodel';
import { PostalCode } from '../../models/postalcode'; // Assuming the PostalCode model is imported
import { GenericService } from '../../service/generic.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerModel: RegisterModel = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    postalCodeId: 0, // Default postalCodeId
    isAdmin: false,
  };
  postalCodes: PostalCode[] = [];
  errorMessage: string | undefined;
  showPassword: boolean = false;

  constructor(
    private authService: GenericService<RegisterModel>,
    private postalCodeService: GenericService<PostalCode>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchPostalCodes(); // Fetch postal codes when component is initialized
  }

  fetchPostalCodes(): void {
    // Assuming you have a service that fetches postal codes
    this.postalCodeService.getAll('PostalCodes').subscribe(
      (response: PostalCode[]) => {
        this.postalCodes = response; // Store fetched postal codes
      },
      (error) => {
        console.error('Error fetching postal codes:', error);
        this.errorMessage = 'Error fetching postal codes. Please try again.';
      }
    );
  }

  register(): void {
    this.authService.register(this.registerModel).subscribe(
      (response) => {
        alert('Registration successful! You can now log in.');
        this.router.navigate(['/login']); // Redirect to login page after registration
      },
      (error) => {
        // Handle different error statuses
        if (error.status === 400) {
          this.errorMessage =
            'Invalid registration data. Please check your input.';
        } else if (error.status === 500) {
          this.errorMessage = 'Server error occurred. Please try again later.';
        } else {
          this.errorMessage =
            'Error occurred while registering, please try again.';
        }
      }
    );
  }
}
