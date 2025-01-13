import { Component } from '@angular/core';
import { LoginRequest } from '../../models/loginrequest';
import { GenericService } from '../../service/generic.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginResponse } from '../../models/loginresponse';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginRequest: LoginRequest = {
    email: '',
    password: '',
  };
  errorMessage: string | undefined;

  constructor(
    private authService: GenericService<LoginRequest>,
    private router: Router
  ) {}

  login(): void {
    this.authService.login(this.loginRequest).subscribe(
      (response: LoginResponse) => {
        console.log('Login successful!', response);

        localStorage.setItem('token', response.token || ''); // Store token
        localStorage.setItem('firstName', response.firstName || ''); // Store first name
        localStorage.setItem('lastName', response.lastName || ''); // Store last name
        localStorage.setItem('isAdmin', String(response.isAdmin)); // Store role info (admin)

        alert('Login successful!');
        this.router.navigate(['/home']).then(() => {
          window.location.reload();
        }); // Redirect to a protected page
      },
      (error) => {
        this.errorMessage = 'Invalid credentials, please try again.';
      }
    );
  }
}
