import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

// Entry to API
export class UserService {
  // URL
  // JSON | XML - formatter
  // GET, POST, PUT, DELETE

  private readonly url: string = 'https://localhost:7206/api/Users';
  
  constructor(private http: HttpClient) {}

  userList: User[] = [
    {
      userId: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: '2oF6q@example.com',
      postalCodeId: 1234,
    },
    {
      userId: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'fQ2yQ@example.com',
      postalCodeId: 1234,
    },
    {
      userId: 3,
      firstName: 'Bob',
      lastName: 'Doe',
      email: '2oF6q@example.com',
      postalCodeId: 1234,
    },
  ];

  getall(): User[] {
    return this.userList;
  }

  // version 2 - Hardcoded
  getall2(): User[] {
    return this.userList;
  }

  // version 3 - harcoded
  getall3(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  // Delete by Id
  deletebyid(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`); 
  }

  // Update user by ID
  updatebyid(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.url}/${id}`, user);  // Send PUT request to update user
  }

  // Create
  create(user: User): Observable<User> {
    return this.http.post<User>(this.url, user);  
  }

  // Get User by ID
  getbyid(id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/${id}`);
  }
  
  

}
