import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {

  @Output() search = new EventEmitter<string>();

  searchText = "";
  isLoggedIn = false;
  username = "";
  isLoading = false;
  private readonly keycloak = inject<InstanceType<typeof Keycloak>>(Keycloak);

  async ngOnInit(): Promise<void> {
    await this.checkAuthStatus();
    await this.loadUserProfile();
    // Authentication is handled by backend via JWT tokens
    // User status can be checked via API calls if needed
  }

  async checkAuthStatus(): Promise<void> {
    this.isLoggedIn = this.keycloak.authenticated === true;
  }

  async loadUserProfile(): Promise<void> {
    if (!this.isLoggedIn) return;

    try {
      const profile = await this.keycloak.loadUserProfile();
      this.username =
        profile.username ||
        profile.firstName ||
        profile.email ||
        "User";
    } catch (err) {
      console.error("Error loading user profile:", err);
      this.username = "User";
    }
  }

  onSearch(): void {
    this.search.emit(this.searchText);
  }

  async login(): Promise<void> {
    console.log("Login requested");
    this.isLoading = true;

    try {
      // Check if Keycloak instance exists
      if (!this.keycloak) {
        console.error("Keycloak instance is not available");
        alert("Keycloak is not initialized. Please refresh the page.");
        this.isLoading = false;
        return;
      }

      // Check if Keycloak is initialized (authenticated can be true, false, or undefined)
      // undefined means Keycloak hasn't initialized yet
      if (this.keycloak.authenticated === undefined) {
        console.log("Keycloak is initializing, waiting...");
        // Wait for Keycloak to initialize (check every 100ms, timeout after 5 seconds)
        let attempts = 0;
        const maxAttempts = 50;

        while (this.keycloak.authenticated === undefined && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (this.keycloak.authenticated === undefined) {
          console.error("Keycloak initialization timed out");
          alert("Keycloak initialization timed out. Please check if Keycloak server is running at http://localhost:8080");
          this.isLoading = false;
          return;
        }
      }

      console.log("Calling Keycloak login...");
      // Call Keycloak login - this should redirect the browser
      await this.keycloak.login({
        redirectUri: window.location.origin
      });

      // Note: If login succeeds, the browser will redirect, so code below won't execute
      console.log("Login initiated successfully");
    } catch (error: any) {
      console.error("Login error:", error);
      console.error("Error details:", {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });

      // Show user-friendly error message
      const errorMessage = error?.message || "Unknown error occurred";
      alert(`Login failed: ${errorMessage}\n\nPlease check:\n1. Keycloak server is running at http://localhost:8080\n2. Keycloak realm 'shophub' exists\n3. Client 'frontend-client' is configured correctly`);

      this.isLoading = false;
    }
  }

  logout(): void {
    // Handle logout via API
    console.log("Logout requested");
    this.isLoggedIn = false;
    this.username = "";
    this.keycloak
      .logout({
        redirectUri: window.location.origin
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  }
}
