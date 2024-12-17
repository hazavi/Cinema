import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GenericService } from '../../service/generic.service';
import { RouterModule, Router } from '@angular/router';
import { Genre } from '../../models/genre';
import { Movie } from '../../models/movie';
@Component({
  selector: 'app-create-genre',
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './create-genre.component.html',
  styleUrl: './create-genre.component.css',
})
export class CreateGenreComponent {
  genreList: Genre[] = [];
  movieList: Movie[] = [];
  genreForm!: FormGroup;

  constructor(
    private genreService: GenericService<Genre>,
    private movieService: GenericService<Movie>,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.genreForm = this.fb.group({
      genreName: ['', Validators.required],
      movies: [[]], // Optional field (default: empty array)
    });
    // Generic - Get All Genre
    this.genreService.getAll('Genres').subscribe((data: Genre[]) => {
      this.genreList = data;
    });
    // Generic - Get All Movie
    this.movieService.getAll('Movies').subscribe((data: Movie[]) => {
      this.movieList = data;
    });
  }

  onSubmit(): void {
    if (this.genreForm.valid) {
      const newGenre: Genre = this.genreForm.value;

      // Send data to API (Generic Service)
      this.genreService.create('Genres', newGenre).subscribe({
        next: () => {
          console.log('Genre created successfully.');
          this.router.navigate(['/admin']); // Redirect after success
        },
        error: (err) => {
          console.error('Error creating genre:', err);
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
