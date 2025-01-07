import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from '../models/address';

const httpOptions = {
  heades: new HttpHeaders({
    'content-type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class GenericService<Model> {
  private readonly url: string = 'https://localhost:7206/api';

  constructor(private http: HttpClient) {}

  // Get All Model
  getAll(endPoint: string): Observable<Model[]> {
    return this.http.get<Model[]>(this.url + '/' + endPoint); // GET
  }

  // Get Model by ID
  getbyid(endPoint: string, id: number): Observable<Model> {
    return this.http.get<Model>(`${this.url}/${endPoint}/${id}`); // GET{Id}
  }

  // Create Model
  create(endPoint: string, model: Model): Observable<Model> {
    return this.http.post<Model>(`${this.url}/${endPoint}`, model); // POST
  }

  create2<T>(endPoint: string, model: T): Observable<T> {
    return this.http.post<T>(`${this.url}/${endPoint}`, model); // POST
  }
  // Generic method to handle image upload
  uploadImage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.url}/movies/upload-image`, formData); // POST
  }
  // Update Model by ID
  updatebyid(endPoint: string, id: number, model: Model): Observable<Model> {
    return this.http.put<Model>(`${this.url}/${endPoint}/${id}`, model); // PUT
  }

  // Delete Model by Id
  deletebyid(endPoint: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${endPoint}/${id}`); // DELETE
  }
}
