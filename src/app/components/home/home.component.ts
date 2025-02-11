import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { GenericService } from '../../service/generic.service';
import { MovieResponse } from '../../models/movieresponse';

interface Movie {
  id: number;
  title: string;
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  slideInterval: any;
  slides: string[] = [
    'assets/imgs/c1.jpg',
    'assets/imgs/c2.jpg',
    'assets/imgs/c3.jpg',
  ];

  movies: MovieResponse[] = [];

  constructor(
    private movieService: GenericService<MovieResponse>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.startSlideshow();
    this.movieService.getAll('Movies').subscribe((data: MovieResponse[]) => {
      // Sort movies by release date in descending order (latest first)
      const sortedMovies = data.sort((a, b) => {
        if (!a.releaseDate || !b.releaseDate) {
          return 0; // Handle cases where releaseDate might be undefined
        }
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      });
    
      // Fetch only the last 4 movies (latest 4 movies based on release date)
      this.movies = sortedMovies.slice(0, 4);
    });
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startSlideshow(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }
  viewMovie(movieId: number, movieName: string): void {
    const formattedName = movieName.replace(/\s+/g, '-').toLowerCase(); // Format name for URL
    this.router.navigate(['/movie', movieId, formattedName]); // Navigate with both id and movieName
  }
}
