import { Component } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-address',
  imports: [],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent {


  constructor(private service: UserService, private http:HttpClient) {}

}
