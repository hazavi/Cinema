import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { GenericService } from '../../service/generic.service';
import { Router } from '@angular/router';
import { Genre } from '../../models/genre';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-movie',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-movie.component.html',
  styleUrls: ['./create-movie.component.css'],
})
export class CreateMovieComponent implements OnInit {
  movieForm: FormGroup;
  genres: Genre[] = [];
  selectedFiles: File[] = [];

  constructor(
    private movieService: GenericService<any>,
    private genreService: GenericService<Genre>,
    private router: Router
  ) {
    this.movieForm = new FormGroup({
      posterUrl: new FormControl('', Validators.required),
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', Validators.required),
      durationMinutes: new FormControl(0, [Validators.required, Validators.min(1)]),
      rating: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(10)]),
      releaseDate: new FormControl('', Validators.required),
      genreIds: new FormControl([], Validators.required),
      isShowing: new FormControl(false),
    });
  }

  ngOnInit(): void {
    this.genreService
      .getAll('Genres')
      .subscribe((data) => (this.genres = data));
  }

  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files; // Save the selected files
  }
  
  onSubmit(): void {
    if (this.movieForm.invalid) {
      Object.keys(this.movieForm.controls).forEach((key) => {
        this.movieForm.get(key)?.markAsTouched();
      });
      return;
    }
  
    const formData = new FormData();
  
    // Append the poster file to the formData
    if (this.selectedFiles.length > 0) {
      formData.append('posterFile', this.selectedFiles[0], this.selectedFiles[0].name);
    } else {
      alert('Please upload a poster image.');
      return;
    }
  
    // Append the rest of the form data
    formData.append('title', this.movieForm.get('title')?.value);
    formData.append('description', this.movieForm.get('description')?.value);
    formData.append('durationMinutes', this.movieForm.get('durationMinutes')?.value.toString());
    formData.append('rating', this.movieForm.get('rating')?.value.toString());
    formData.append(
      'releaseDate',
      new Date(this.movieForm.get('releaseDate')?.value).toISOString().split('T')[0]
    );
    formData.append('isShowing', this.movieForm.get('isShowing')?.value.toString());
  
    // Append genreIds as separate values instead of a single JSON string
    const genreIds = this.movieForm.get('genreIds')?.value;
    genreIds.forEach((genreId: number) => {
      formData.append('genreIds', genreId.toString());
    });
  
    // Make the POST request to the API
    this.movieService.create2('Movies', formData).subscribe(
      () => {
        alert('Movie created successfully');
        this.movieForm.reset();
        this.router.navigate(['/admin']);
      },
      (error) => {
        alert('Error creating movie');
        console.error(error);
      }
    );
  }
  
}
