import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { GenericService } from '../../service/generic.service';
import { Address } from '../../models/address';
import { CommonModule } from '@angular/common';
import { PostalCode } from '../../models/postalcode';

@Component({
  selector: 'app-create-address',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-address.component.html',
  styleUrl: './create-address.component.css',
})
export class CreateAddressComponent {
  addressForm: FormGroup;
  postalCodeList: PostalCode[] = [];

  constructor(
    private fb: FormBuilder,
    private addressService: GenericService<Address>,
    private postalCodeService: GenericService<PostalCode>,
    private router: Router
  ) {
    this.addressForm = this.fb.group({
      streetName: ['', [Validators.required, Validators.maxLength(100)]],
      streetNumber: [0, [Validators.required, Validators.pattern(/^\d+$/)]],
      postalCodeId: [0, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.fetchPostalCodes();
  }
  fetchPostalCodes(): void {
    this.postalCodeService.getAll('PostalCodes').subscribe({
      next: (data) => {
        this.postalCodeList = data; // Assuming the data is an array of postal codes
      },
      error: (err) => {
        console.error('Error fetching postal codes:', err);
        alert('Failed to load postal codes.');
      },
    });
  }
  onSubmit(): void {
    if (this.addressForm.valid) {
      const address: Address = {
        addressId: 0, // Default ID for creation
        streetName: this.addressForm.value.streetName,
        streetNumber: this.addressForm.value.streetNumber,
        postalCodeId: this.addressForm.value.postalCodeId,
      };

      this.addressService.create('Addresses', address).subscribe({
        next: () => {
          alert('Address created successfully!');
          this.router.navigate(['/admin']); // Navigate to the address list
        },
        error: (err) => {
          console.error('Error creating address:', err);
          alert('Failed to create address.');
        },
      });
    } else {
      alert('Form is invalid. Please fill all required fields.');
    }
  }
}
