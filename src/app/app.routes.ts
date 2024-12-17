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

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // home
  { path: 'login', component: LoginComponent }, // Login Page
  { path: 'admin', component: AdminComponent }, // Admin Page
  { path: 'home', component: HomeComponent }, // Home Page
  { path: 'showing', component: ShowingComponent }, // Showing Page
  { path: 'users', component: UserComponent }, // User list page
  { path: 'add-movie', component: CreateMovieComponent }, // Create movie form
  { path: 'create-user', component: CreateUserComponent }, // Create user form
  { path: 'create-genre', component: CreateGenreComponent }, // Create user form
  { path: 'view-user/:id', component: ViewUserComponent }, // view user
  { path: 'update-user/:id', component: UpdateUserComponent }, // update user
];

// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { CreateUserComponent } from './components/user/create-user/create-user.component'; // Ensure the path is correct
// import { UserComponent } from './components/user/user.component'; // Ensure the path is correct

// // Define your app routes
// const routes: Routes = [
//   { path: '', redirectTo: '/users', pathMatch: 'full' }, // Redirect to users list by default
//   { path: 'users', component: UserComponent }, // User list page
//   { path: 'create-user', component: CreateUserComponent }, // Create user form
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)], // Import and configure the routes
//   exports: [RouterModule], // Export RouterModule so it can be used in other parts of the app
// })
// export class AppRoutingModule {}
