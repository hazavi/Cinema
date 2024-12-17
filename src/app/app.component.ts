import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserComponent } from './components/user/user.component';
import { RouterModule } from '@angular/router';

// Decorator for the component
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Cinema';
  isMobileMenuOpen = false;

  constructor() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown')) {
        this.closeAllDropdowns();
      }
    });
  }
  toggleDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const dropdownElement = (event.currentTarget as HTMLElement).closest(
      '.dropdown'
    );
    const wasActive = dropdownElement?.classList.contains('active');

    // Close all other dropdowns
    this.closeAllDropdowns();

    // Toggle current dropdown if it wasn't already active
    if (!wasActive && dropdownElement) {
      dropdownElement.classList.add('active');
      const menu = dropdownElement.querySelector('.dropdown-menu');
      menu?.classList.add('show');
    }
  }

  closeAllDropdowns() {
    document.querySelectorAll('.dropdown').forEach((dropdown) => {
      dropdown.classList.remove('active');
      const menu = dropdown.querySelector('.dropdown-menu');
      menu?.classList.remove('show');
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
