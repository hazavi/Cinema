import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GenericService } from '../../service/generic.service';
import { User } from '../../models/user';
import { RouterModule } from '@angular/router';
import { PostalCode } from '../../models/postalcode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent {
  postalCodeList: PostalCode[] = [];
  userList: User[] = [];
  userForm!: FormGroup;

  constructor(
    private userService: GenericService<User>,
    private postalService: GenericService<PostalCode>,
    private router: Router,
    private fb: FormBuilder
  ) {}

  onSubmit(): void {
    if (this.userForm.valid) {
      const newUser = this.userForm.value; // Get form values
      console.log('Form value:', newUser);
      // newUser.isAdmin will correctly reflect the checkbox state
      newUser.passwordHash = ''; // Initially, password hash will be empty
      newUser.passwordSalt = '';
      console.log('isAdmin:', this.userForm.get('isAdmin')?.value);

      this.userService.create('Users', newUser).subscribe(
        (response) => {
          console.log('User Created Successfully', response);
          alert('User Created Successfully');
          this.router.navigate(['/admin']); // Redirect after success
        },
        (error) => {
          console.error('Error creating user:', error);
          alert('An error occurred while creating the user.');
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      postalCodeId: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]], // Password field with validation
      confirmPassword: ['', [Validators.required, this.passwordMatchValidator]], // Confirm password field
      isAdmin: [false], // New field to specify admin role
    });

    // Get all users (optional)
    this.userService.getAll('Users').subscribe((data: User[]) => {
      this.userList = data;
    });

    // Get all postal codes
    this.postalService.getAll('PostalCodes').subscribe((data: PostalCode[]) => {
      this.postalCodeList = data;
    });
  }

  // Custom validator to check if the password and confirm password match
  passwordMatchValidator(
    control: FormControl
  ): { [key: string]: boolean } | null {
    const password = control.root?.get('password')?.value;
    return password && password !== control.value ? { mismatch: true } : null;
  }
}
