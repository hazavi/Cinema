import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { GenericService } from '../../service/generic.service';
import { PostalCode } from '../../models/postalcode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-postalcode',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-postalcode.component.html',
  styleUrl: './create-postalcode.component.css',
})
export class CreatePostalcodeComponent {
  postalCodeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private postalcodeService: GenericService<PostalCode>,
    private router: Router
  ) {
    this.postalCodeForm = this.fb.group({
      postalCodeId: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{4}$/)],
      ], // PostalCode is a 5-digit value.
      name: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.postalCodeForm.valid) {
      const postalCode: PostalCode = {
        postalCodeId: this.postalCodeForm.value.postalCodeId,
        name: this.postalCodeForm.value.name,
      };

      this.postalcodeService.create('PostalCodes', postalCode).subscribe({
        next: () => {
          alert('Postal Code created successfully!');
          this.router.navigate(['/admin']); // Navigate to the postal codes list
        },
        error: (err) => {
          console.error('Error creating postal code:', err);
          alert('Failed to create postal code.');
        },
      });
    } else {
      alert('Form is invalid. Please fill all required fields correctly.');
    }
  }

  Back(): void {
    this.router.navigate(['/admin']); // Navigate to the postal codes list
  }
}
