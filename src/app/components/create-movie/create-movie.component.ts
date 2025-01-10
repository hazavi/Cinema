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

  constructor(
    private movieService: GenericService<any>,
    private genreService: GenericService<Genre>,
    private router: Router
  ) {
    this.movieForm = new FormGroup({
      posterUrl: new FormControl('', [
        Validators.required,
        Validators.pattern('assets/posters/.+'),
      ]),
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      durationMinutes: new FormControl('', [
        Validators.required,
        Validators.min(1),
      ]),
      rating: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(10),
      ]),
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

  onSubmit(): void {
    if (this.movieForm.invalid) return;

    const {
      posterUrl,
      title,
      description,
      durationMinutes,
      rating,
      releaseDate,
      genreIds,
      isShowing,
    } = this.movieForm.value;
    const payload = {
      posterUrl,
      title,
      description,
      durationMinutes,
      rating,
      releaseDate: new Date(releaseDate).toISOString().split('T')[0],
      genreIds,
      isShowing,
    };

    this.movieService.create2('Movies', payload).subscribe(
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
