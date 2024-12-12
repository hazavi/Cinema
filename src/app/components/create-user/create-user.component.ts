import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GenericService } from '../../service/generic.service';
import { User } from '../../models/user';
import { RouterModule } from '@angular/router';
import { PostalCode } from '../../models/postalcode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent {
  postalCodeList: PostalCode[] = [];
  userList: User[] = [];

  constructor(
    private userService: GenericService<User>,
    private postalService: GenericService<PostalCode>,
    private router: Router
  ) {}

  // HTML Forms - Reactive Forms
  userForm: FormGroup = new FormGroup({
    userId: new FormControl(),
    firstName: new FormControl(), // validators
    lastName: new FormControl(),
    email: new FormControl(),
    postalCodeId: new FormControl(),
  });

  onSubmit(): void {
    if (this.userForm.valid) {
      const newUser = this.userForm.value;
      this.userService.create('Users', newUser).subscribe((response) => {
        console.log('User Created Successfully', response);
        alert('User Created Successfully');
        // Redirect after success
        this.router.navigate(['/users']);
      });
    }
  }

  ngOnInit(): void {
    // this.userForm = this.fb.group({
    //   firstName: ['', Validators.required],
    //   lastName: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]],
    //   postalCodeId: ['', Validators.required],
    // });

    // Generic - Get All User
    this.userService.getAll('Users').subscribe((data: User[]) => {
      this.userList = data;
      console.log('Fetched User Data:', data);
    });

    // Generic - Get All PostalCode
    this.postalService.getAll('PostalCodes').subscribe((data: PostalCode[]) => {
      this.postalCodeList = data;
      console.log('Fetched Postal Data', data);
    });
  }
}
