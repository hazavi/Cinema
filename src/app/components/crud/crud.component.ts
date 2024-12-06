import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crud',
  imports: [FormsModule, CommonModule],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.css'
})
// ng g c components\crud
// ng serve -o | start webserver
// ctrl + c | stopper webserver i terminal
// create, delete, getall, update

export class CrudComponent {
  // variables
  names : string[] = ['John Doe', 'Jane Doe', 'Bob Doe'];
  name_input : string = '';
  btn1 : boolean = false;
  btn2 : boolean = false;


  // functions
  
  // Create/Add name
  addName(): void {
    this.btn1 = !this.btn1;

    if (this.name_input.trim() !== '') {
      this.names.push(this.name_input);
      alert(`${this.name_input} is successfully added to the array!`);
      this.name_input = ''; 
    } 
  }

  // Get All Names
  getAllNames() {
    if (this.names.length === 0) {
      console.log('No names found.');
      return []
    } else {
      return this.names;

    }
  }

  // Update Name
  updateName(){
    this.btn2 = !this.btn2;

  }

  // Delete Name
  deleteName(id: number): void {
    if (id >= 0 && id < this.names.length) {
      const deletedName = this.names.splice(id, 1); 
      alert(`${deletedName} has been deleted.`);
    } else {
      alert('Invalid index provided.');
    }
  }

}
