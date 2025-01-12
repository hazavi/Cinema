import { Routes } from '@angular/router';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { UserComponent } from './components/user/user.component';
import { HomeComponent } from './components/home/home.component';
import { ViewUserComponent } from './components/view-user/view-user.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { ShowingComponent } from './components/showing/showing.component';
import { CreateMovieComponent } from './components/create-movie/create-movie.component';
import { CreateGenreComponent } from './components/create-genre/create-genre.component';
import { ViewMovieComponent } from './components/view-movie/view-movie.component';
import { UpdateMovieComponent } from './components/update-movie/update-movie.component';
import { CreatePostalcodeComponent } from './components/create-postalcode/create-postalcode.component';
import { CreateAddressComponent } from './components/create-address/create-address.component';
import { CreateTheaterComponent } from './components/create-theater/create-theater.component';
import { CreateShowtimeComponent } from './components/create-showtime/create-showtime.component';
import { MovieComponent } from './components/movie/movie.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default redirect to home
  { path: 'home', component: HomeComponent }, // Home Page
  { path: 'login', component: LoginComponent }, // Login Page
  { path: 'register', component: RegisterComponent }, // Register Page
  { path: 'movie/:id/:movieName', component: MovieComponent }, // Movie Page

  // Admin-related routes
  {
    path: 'admin',
    children: [
      { path: '', component: AdminComponent },
      { path: 'add-movie', component: CreateMovieComponent }, // Create movie form
      { path: 'view-movie/:id', component: ViewMovieComponent }, // View movie details
      { path: 'update-movie/:id', component: UpdateMovieComponent }, // Update movie
      { path: 'create-genre', component: CreateGenreComponent }, // Create genre
      { path: 'create-postalcode', component: CreatePostalcodeComponent }, // Create postal code
      { path: 'create-address', component: CreateAddressComponent }, // Create address
      { path: 'create-theater', component: CreateTheaterComponent }, // Create theater
      { path: 'create-showtime', component: CreateShowtimeComponent }, // Create Showtime
    ],
  },

  // User-related routes
  {
    path: 'users',
    children: [
      { path: '', component: UserComponent }, // User list
      { path: 'create', component: CreateUserComponent }, // Create user
      { path: 'view/:id', component: ViewUserComponent }, // View user
      { path: 'update/:id', component: UpdateUserComponent }, // Update user
    ],
  },

  // Showing-related routes
  { path: 'showing', component: ShowingComponent }, // Showing page
];
