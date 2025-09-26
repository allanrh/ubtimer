import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HomeComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ubtimer';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Ensure hydration completes properly
    if (isPlatformBrowser(this.platformId)) {
      // Add a small delay to ensure all components are hydrated
      setTimeout(() => {
        // This helps ensure the application becomes stable
        console.log('App hydration completed');
      }, 50);
    }
  }
}
