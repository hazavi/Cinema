import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserComponent } from './components/user/user.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GenericService } from './service/generic.service';
import { User } from './models/user';

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
    private userService: GenericService<User>,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.updateUserFirstName();
    this.FetchUserId();
    this.isUserAdmin = localStorage.getItem('isAdmin') === 'true';
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
