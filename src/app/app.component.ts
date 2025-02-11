import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserComponent } from './components/user/user.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GenericService } from './service/generic.service';
import { User } from './models/user';
import { Title } from '@angular/platform-browser';

// Decorator for the component
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Cinema';
  isMobileMenuOpen = false;
  userFirstName: string | null = null;
  user: User | null = null;
  isUserAdmin: boolean = false;
  userId: number | null = null;
  constructor(
    private titleService: Title,

    private userService: GenericService<User>,
    private router: Router,
    private activatedRoute: ActivatedRoute

  ) {}
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Get the data property from the current route
        let title = this.getTitle(this.activatedRoute);
        this.titleService.setTitle(title || 'Bioma');
      }
    });

    this.updateUserFirstName();
    this.FetchUserId();
    this.isUserAdmin = localStorage.getItem('isAdmin') === 'true';
    
  }

  // Recursive function to extract the title or dynamic parameters
  getTitle(route: ActivatedRoute): string | null {
    while (route.firstChild) {
      route = route.firstChild;
    }

    // Check if the route has a static title in its data
    if (route.snapshot.data['title']) {
      return route.snapshot.data['title'];
    }

    // For dynamic routes like 'movie/:id/:movieName', extract the movieName parameter
    const movieName = route.snapshot.params['movieName'];
    if (movieName) {
      return `${this.capitalize(movieName)} - Bioma`;
    }

    return null;
  }
  
   // Helper function to capitalize the first letter of each word
   capitalize(str: string): string {
    return str
      .split('-') // Split by hyphen (if movie names contain hyphens)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  FetchUserId(): void {
    this.userId = parseInt(localStorage.getItem('userId') || '0', 10);
    console.log(this.userId);
  }
  updateUserFirstName(): void {
    this.userFirstName = localStorage.getItem('firstName');
  }

  logout(): void {
    localStorage.clear();
    this.userFirstName = null;
    alert('Logged out successfully.');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  toggleMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-start');
    const navEnd = document.querySelector('.nav-end');

    mobileMenu?.classList.toggle('active');
    navLinks?.classList.toggle('active');
    navEnd?.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }
}
