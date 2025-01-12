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
    token: '',
  };
  errorMessage: string | undefined;

  constructor(
    private authService: GenericService<LoginRequest>,
    private router: Router
  ) {}

  login(): void {
    this.authService.login(this.loginRequest).subscribe(
      (response: LoginResponse) => {
        // Use LoginResponseDto here
        localStorage.setItem('token', response.token || ''); // If token is undefined, set an empty string
        this.router.navigate(['/home']); // Redirect to a protected page
      },
      (error) => {
        this.errorMessage = 'Invalid credentials, please try again.';
      }
    );
  }
}
