import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserComponent } from './components/user/user.component';

// Decorator for the component
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, UserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Cinema';

  // variables
  //int x = 1; // c#
  age: number = 21; // interger typescript
  name: string = 'John Doe'; // string typescript
  names: string[] = ['John Doe', 'Jane Doe', 'Bob Doe']; // array of string
  name_input: string = '';
  sandt: boolean = true;

  // functions - methods
  sayHello(): void {
    // signature / prototype
    console.log('Hello World');
  }
  sayHello2(name: string): void {
    // signature / prototype
    console.log('Hello, ' + name);
  }

  submit() {
    alert(`Hello: ${this.name_input}`);
  }

  ngOnInit(): void {
    this.sayHello();
  }
}
