import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { KeycloakService } from 'keycloak-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor(
    // private keycloakService: KeycloakService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Checking if user is already authenticated
    // if (this.keycloakService.isLoggedIn()) {
    //   // Redirect to home if already logged in
    //   this.router.navigate(['/']);
    // }
    // Authentication is handled by backend via JWT tokens
  }

  login(): void {
    this.isLoading = true;
    // Handle login via API
    console.log('Login requested');
    // this.keycloakService.login({
    //   redirectUri: window.location.origin
    // }).then(() => {
    //   this.isLoading = false;
    // }).catch((error) => {
    //   console.error('Login error:', error);
    //   this.isLoading = false;
    // });
    this.isLoading = false;
  }

  signUp(): void {
    this.isLoading = true;
    // Handle registration via API
    console.log('Registration requested');
    // this.keycloakService.register({
    //   redirectUri: window.location.origin
    // }).then(() => {
    //   this.isLoading = false;
    // }).catch((error) => {
    //   console.error('Registration error:', error);
    //   this.isLoading = false;
    // });
    this.isLoading = false;
  }
}

