import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { UserService } from '../../service/user.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AddressService } from '../../service/address.service';
import { Address } from '../../models/address';
import { GenericService } from '../../service/generic.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostalCode } from '../../models/postalcode';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, CommonModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  // userList: User[] = [
  //   { userId: 1, firstName: 'John', lastName: 'Doe', email: '2oF6q@example.com',postalCodeId: 1234,},
  //   { userId: 2, firstName: 'Jane', lastName: 'Doe', email: 'fQ2yQ@example.com', postalCodeId: 1234,},
  //   { userId: 3, firstName: 'Bob', lastName: 'Doe', email: '2oF6q@example.com', postalCodeId: 1234,},
  // ];

  userList: User[] = [];
  addressList: Address[] = [];
  postalCodeList: PostalCode[] = [];

  constructor(
    private service: UserService,
    private addressService: AddressService,
    private genericService: GenericService<User>,
    private postalService: GenericService<PostalCode>,
    private http: HttpClient
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
      this.genericService.create('Users', newUser).subscribe((response) => {
        console.log('User Created Successfully', response);
        // Redirect after success (optional)
      });
    }
  }

  ngOnInit() {
    // console.log(this.getall());
    // this.userList = this.service.getall();
    // console.log(this.userList);

    // version 3
    // this.service.getall3().subscribe((data) => console.log(data));

    // this.service.getall3().subscribe((data: User[]) => {
    //   this.userList = data;
    //   console.log('Fetched User Data:', data);
    // });

    // Generic - Get All User
    this.genericService.getAll('Users').subscribe((data: User[]) => {
      this.userList = data;
      console.log('Fetched User Data:', data);
    });

    // Get All Address
    this.addressService.getall().subscribe((data: Address[]) => {
      this.addressList = data;
      console.log('Fetched Address Data:', data);
    });
    // Generic - Get All PostalCode
    this.postalService.getAll('PostalCodes').subscribe((data: PostalCode[]) => {
      this.postalCodeList = data;
      console.log('Fetched Postal Data', data);
    });

    // Get user by id
    // this.service.getbyid(14).subscribe((data: User[]) => {
    //   console.log('Get User By Id:', data);
    // });

    // Generic - Get user by id
    this.genericService.getbyid('Users', 16).subscribe((data: User[]) => {
      console.log('Fetched User By Id:', data);
    });
  }

  // Create User
  // createUser() {
  //   const newUser: User = {
  //     userId: 0,
  //     firstName: 'Harry',
  //     lastName: 'Potter',
  //     email: 'harry.potter@example.com',
  //     postalCodeId: 1270,
  //   };

  //   // Create user and log the result
  //   this.service.create(newUser).subscribe((createdUser) => {
  //     console.log('Created User:', createdUser);
  //   });
  // }

  // Update user by id
  updateUser() {
    const updatedUser: User = {
      userId: 1,
      firstName: 'Sasuke',
      lastName: 'Uchiha',
      email: 'sasuke.uchiha@clan.com',
      postalCodeId: 2610,
    };
    this.genericService
      .updatebyid('Users', 16, updatedUser)
      .subscribe((updatedUser) => {
        console.log('Updated User Successfully! ', updatedUser);
      });
  }

  // Generic - Create User
  // createUser() {
  //   const newUser: User = {
  //     userId: 0,
  //     firstName: 'Black',
  //     lastName: 'Panther',
  //     email: 'black.panther@example.com',
  //     postalCodeId: 2610,
  //   };

  //   // Create user and log the result
  //   this.genericService.create('Users', newUser).subscribe((createdUser) => {
  //     console.log('User is Created Successfully!', createdUser);
  //   });
  // }

  deleteUser(id: number) {
    this.genericService.deletebyid('Users', id).subscribe(() => {
      console.log(`User with ID: ${id}, is deleted successfully`);
    });
  }
  // Delete
  // deleteUser(id: number) {
  //   this.service.deletebyid(id).subscribe(() => {
  //     console.log(`User with ID ${id} deleted successfully`);
  //   });
  // }

  // getall3():Observable<User[]>{
  //   return this.http.get<User[]>("https://localhost:7206/api/Users");
  // }

  // Get All User
  getall(): User[] {
    return this.userList;
  }
}
