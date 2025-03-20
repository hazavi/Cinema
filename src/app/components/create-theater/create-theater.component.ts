import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { GenericService } from '../../service/generic.service';
import { CommonModule } from '@angular/common';
import { Theater } from '../../models/theater';
import { Address } from '../../models/address';
import { PostalCode } from '../../models/postalcode';

@Component({
  selector: 'app-create-theater',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-theater.component.html',
  styleUrl: './create-theater.component.css',
})
export class CreateTheaterComponent {
  theaterForm: FormGroup;
  theaterList: Theater[] = [];
  addressList: Address[] = [];
  postalCodeList: PostalCode[] = [];
  theaterNames: string[] = ['FBio', 'KBio', 'LBio', 'RBio', 'ABio', 'HBio'];
  capacities: number[] = [40, 80, 120, 130, 200];
  locations: string[] = ['Bio 1', 'Bio 2', 'Bio 3', 'Bio 4', 'Bio 5', 'Bio 6', 'Bio 7', 'Bio 8', 'Bio 9', 'Bio 10'];
  
  constructor(
    private fb: FormBuilder,
    private theaterService: GenericService<Theater>,
    private addressService: GenericService<Address>,
    private postalService: GenericService<PostalCode>,
    private router: Router
  ) {
    this.theaterForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      location: ['', [Validators.required]],
      addressId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.addressService.getAll('addresses').subscribe({
      next: (addresses) => {
        this.addressList = addresses; // Populate addressList with the fetched data
      },
      error: (err) => {
        console.error('Error fetching addresses:', err);
      },
    });
    // Generic - Get All PostalCodes
    this.postalService.getAll('PostalCodes').subscribe((data: PostalCode[]) => {
      this.postalCodeList = data;
    });
  }

  onSubmit(): void {
    if (this.theaterForm.valid) {
      const theater: Theater = {
        theaterId: 0,
        name: this.theaterForm.value.name,
        capacity: this.theaterForm.value.capacity,
        location: this.theaterForm.value.location,
        addressId: this.theaterForm.value.addressId,
      };

      this.theaterService.create('Theaters', theater).subscribe({
        next: () => {
          alert('Theater created successfully!');
          this.router.navigate(['/admin']); // Navigate to the theaters list
        },
        error: (err) => {
          console.error('Error creating theater:', err);
          alert('Failed to create theater.');
        },
      });
    } else {
      alert('Form is invalid. Please fill all required fields correctly.');
    }
  }
  postalIdToName(postalId: number): string {
    const postal = this.postalCodeList.find(
      (pc) => pc.postalCodeId === postalId
    );
    return postal ? postal.name : 'Unknown Postal Code';
  }

  back(): void {
    this.router.navigate(['/admin']); // Navigate back to the theaters list
  }
}
