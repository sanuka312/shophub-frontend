import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Footer } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    Footer,
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ShopHub';

  constructor(
    private readonly _keycloak: Keycloak,
  ){}

  ngOnInit(): void {
    // Hiding the initial loader once the keycloak is initialized
    const initialLoader: HTMLElement | null = document.getElementById('initial-loader');

    // Check if keycloak is initialized
    if (this._keycloak.authenticated !== undefined) {
      // Keycloak is finished initializing, hide the loader
      if (initialLoader) {
        initialLoader.style.display = 'none';
      }
    } else {
      // Wait for keycloak to initialize
      let checkCount = 0;
      const checkInterval = setInterval(() => {
        checkCount++;
        const loaderElement: HTMLElement | null = document.getElementById('initial-loader');

        if (this._keycloak.authenticated !== undefined || checkCount > 100) {
          if (loaderElement) {
            loaderElement.style.display = 'none';
          } else {
            console.error('Initial loader not found');
          }
          clearInterval(checkInterval);
        }

        if (checkCount > 100) {
          console.error('Keycloak initialization timed out');
          clearInterval(checkInterval);
        }
      }, 100);
    }
  }
}

