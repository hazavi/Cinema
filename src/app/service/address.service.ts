import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from '../models/address';
@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private readonly url: string = 'https://localhost:7206/api/Addresses';

  constructor(private http: HttpClient) {}

  getall(): Observable<Address[]> {
    return this.http.get<Address[]>(this.url);
  }
}
