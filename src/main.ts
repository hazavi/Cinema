import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core'; // Import for routing providers
import { RouterModule } from '@angular/router'; // For routing
import { routes } from './app/app.routes'; // Routes configuration
// import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule for API calls

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

// bootstrapApplication(AppComponent, {
//   providers: [
//     importProvidersFrom(RouterModule.forRoot(routes)), // Set up routing
//     importProvidersFrom(HttpClientModule), // Use HttpClientModule for HTTP requests
//   ],
// }).catch((err) => console.error(err));
