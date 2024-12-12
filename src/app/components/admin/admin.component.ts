import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  isDashboardContentVisible = true; // Dashboard content is visible by default
  isUserContentVisible = false; 

  toggleUserContent() {
    if (this.isDashboardContentVisible) {
      this.isDashboardContentVisible = false;
      this.isUserContentVisible = true;
    }
  }

  toggleDashboardContent() {
    if (this.isUserContentVisible) {
      this.isUserContentVisible = false;
      this.isDashboardContentVisible = true;
    }
  }
}
